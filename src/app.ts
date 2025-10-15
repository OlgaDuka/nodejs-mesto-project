import express from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import authrouter from './routes/auth';
import errorHandler from './middleware/error-handler';
import authMiddleware from './middleware/auth';
import userRouter from './routes/users';
import cardRouter from './routes/cards';

require('dotenv').config();

const { PORT = 3000, MONGO_URL = '' } = process.env;
const app = express();

app.use(express.json());
app.use('/', authrouter);
app.use(authMiddleware);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('', (_req, res) => {
  res
    .status(constants.HTTP_STATUS_NOT_FOUND)
    .send({ message: 'Маршрут не найден' });
});

app.use(errorHandler);

const connect = async () => {
  await mongoose.connect(MONGO_URL);
  await app.listen(PORT);
};

connect();
