import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import User from '../models/user';
import NotFoundError from '../errors/not-found';
import BadRequestError from '../errors/bad-request';
import { AuthContext } from '../types';

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  await User.find({})
    .then((users) => res.status(constants.HTTP_STATUS_OK).send({ data: users }))
    .catch((err) => next(err));
};

export const getProfile = async (_req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  try {
    const userId = res.locals.user?._id;
    const profile = await User.findOne({ _id: Object(userId) })
      .orFail(() => new NotFoundError('Профиль не найден'));

    return res.status(constants.HTTP_STATUS_OK).send(profile)
  } catch (err) {
    if (err instanceof Error && err.name === "CastError") {
      return next(new BadRequestError("Невалидный id"));
    }
    return next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .orFail(() => new NotFoundError('Пользователь по указанному _id не найден'));
    return res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return next(new BadRequestError('Невалидный id пользователя'));
    }
    return next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user?._id;
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: Object(userId) },
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => new NotFoundError('Пользователь с указанным _id не найден'));

    return res.status(constants.HTTP_STATUS_OK).send(updatedUser);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    }
    return next(err);
  }
};

export const updateAvatar = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user?._id;
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: Object(userId) },
      { avatar },
      { new: true, runValidators: true },
    )
      .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'));

    return res.status(constants.HTTP_STATUS_OK).send(updatedUser);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
    }
    return next(err);
  }
};
