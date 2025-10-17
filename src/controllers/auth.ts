import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import BadRequestError from '../errors/bad-request';
import ConflictError from '../errors/conflict';
import NotAuthError from '../errors/not-auth';
require('dotenv').config();

const { JWT_SECRET } = process.env;

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password } = req.body;
    const hash = await bcrypt.hash(password, 10)
    const createdUser = await User.create({ ...req.body, password: hash })
    const { _id } = createdUser;

    return res.status(constants.HTTP_STATUS_CREATED).send({ ...req.body, _id });
  } catch (err) {
      if (err instanceof MongooseError.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err instanceof Error && err.message.startsWith('11000')) {
        return next(new ConflictError('Такой пользователь уже есть'));
      }
      return next(err);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password)

    return res.status(constants.HTTP_STATUS_OK).send({
      token: jwt.sign({ _id: user._id }, String(JWT_SECRET), { expiresIn: '7d' }),
    });
  } catch (err) {
      if (err instanceof MongooseError.ValidationError) {
        return next(new NotAuthError('Ошибка авторизации'));
      }
      return next(err);
  }
};
