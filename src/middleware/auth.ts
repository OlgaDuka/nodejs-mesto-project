import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import NotAuthError from '../errors/not-auth';
import { AuthContext } from '../types';

export default (req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NotAuthError('Пользователь неавторизован'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload: JwtPayload | null;

  try {
    payload = jwt.verify(token, 'super-strong-secret') as JwtPayload;
  } catch (err) {
    return next(new NotAuthError('Пользователь неавторизован'));
  }

  res.locals.user = payload; // записываем пейлоуд в объект ответа
  return next(); // пропускаем запрос дальше
};
