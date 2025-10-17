import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import Card from '../models/card';
import { AuthContext } from '../types';
import BadRequestError from '../errors/bad-request';
import NotFoundError from '../errors/not-found';
import ForbiddenError from '../errors/forbidden';

export const getAllCards = async (_req: Request, res: Response, next: NextFunction) => {
  await Card.find({})
    .then((cards) => res.status(constants.HTTP_STATUS_OK).send({ data: cards }))
    .catch((err) => next(err));
};

export const createCard = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user?._id;
    const { name, link } = req.body;
    const newCard = await Card.create({
      name,
      link,
      owner: { _id: Object(userId) },
      createdAt: Date.now(),
    });

    return res.status(constants.HTTP_STATUS_CREATED).send(newCard);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
    }
    return next(err);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const cardDelId = req.params.cardId;
    const userId = res.locals.user?._id;
    const cardFind = await Card.findById(cardDelId)
      .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'));

    if (String(cardFind.owner) !== userId) {
      return next(new ForbiddenError('У вас нет доступа для удаления карточки'));
    }
    const cardDel = await Card.findByIdAndDelete(cardDelId)

    return res.status(constants.HTTP_STATUS_OK).send({ data: cardDel });
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан невалидный _id карточки'));
    }
    return next(err);
  }
};

export const likeCard = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const cardId = req.params.cardId;
    const likes = res.locals.user?._id;
    const cardLike = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes } },
      { new: true },
    )
      .orFail(() => new NotFoundError('Передан несуществующий _id карточки'));
    return res.status(constants.HTTP_STATUS_OK).send(cardLike);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан невалидный _id карточки'));
    }
    return next(err);
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const cardId = req.params.cardId;
    const likes = res.locals.user?._id;
    const cardDislike = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes } },
      { new: true },
    )
      .orFail(() => new NotFoundError('Передан несуществующий _id карточки'));
    return res.status(constants.HTTP_STATUS_OK).send(cardDislike);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан невалидный _id карточки'));
    }
    return next(err);
  }
};
