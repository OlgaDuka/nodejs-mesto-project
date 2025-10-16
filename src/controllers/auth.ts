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
  const { password } = req.body;
  await bcrypt.hash(password, 10)
    .then((hash: string) => User.create({ ...req.body, password: hash }))
    .then((createdUser) => {
      const { _id } = createdUser;
      res.status(constants.HTTP_STATUS_CREATED).send({ ...req.body, _id });
    })
    .catch((err) => {
      if (err instanceof MongooseError.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже есть'));
      } else next(err);
    });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  await User.findUserByCredentials(email, password)
    .then((user) => {
      res.status(constants.HTTP_STATUS_OK).send({
        token: jwt.sign({ _id: user._id }, String(JWT_SECRET), { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      if (err instanceof MongooseError.ValidationError) {
        next(new NotAuthError('Ошибка авторизации'));
      }
      next(err);
    });
};
