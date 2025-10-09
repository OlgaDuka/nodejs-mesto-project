import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import * as path from 'path';
import router from './routes';
import errorHandler from './middleware/error-handler';
import { AuthContext } from './types/auth-context';

const app = express();
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

app.use(express.json());
app.use((_req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  res.locals.user = { _id: '68e67f3d6f83d3bfc80004cb' };
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(router);

app.use(errorHandler);

const connect = async () => {
  await mongoose.connect(MONGO_URL);
  await app.listen(PORT);
};

connect();
