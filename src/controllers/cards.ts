import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import Card from '../models/card';
import { AuthContext } from '../types/auth-context';
import BadRequestError from '../errors/bad-request';
import NotFoundError from '../errors/not-found';

export const getAllCards = async (_req: Request, res: Response, next: NextFunction) => {
  await Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

export const createCard = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const { name, link } = req.body;
    const userId = res.locals.user;
    const newCard = await Card.create({
      name,
      link,
      owner: userId,
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
  res: Response,
  next: NextFunction,
) => {
  try {
    const cardDel = await Card.findByIdAndDelete(req.params.cardId)
      .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'));
    return res.status(constants.HTTP_STATUS_OK).send(cardDel);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      next(new BadRequestError('Передан невалидный _id карточки'));
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
    const cardLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: res.locals.user } },
      { new: true },
    )
      .orFail(() => new NotFoundError('Передан несуществующий _id карточки'));
    return res.status(constants.HTTP_STATUS_OK).send(cardLike);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      next(new BadRequestError('Передан невалидный _id карточки'));
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
    const { _id: likes } = res.locals.user;
    const cardDislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes } },
      { new: true },
    )
      .orFail(() => new NotFoundError('Передан несуществующий _id карточки'));
    return res.status(constants.HTTP_STATUS_OK).send(cardDislike);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      next(new BadRequestError('Передан невалидный _id карточки'));
    }
    return next(err);
  }
};
