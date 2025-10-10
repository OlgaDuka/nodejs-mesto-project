import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import User from '../models/user';
import NotFoundError from '../errors/not-found';
import BadRequestError from '../errors/bad-request';
import { AuthContext } from '../types/auth-context';

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  await User.find({})
    .then((users) => res.status(constants.HTTP_STATUS_OK).send({ data: users }))
    .catch((err) => next(err));
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

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    return res.status(constants.HTTP_STATUS_CREATED).send(newUser);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
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
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      res.locals.user,
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
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      res.locals.user,
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
