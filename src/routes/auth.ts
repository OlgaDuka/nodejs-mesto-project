import { Router } from 'express';
import { login, register } from '../controllers/auth';

const authRouter = Router();

authRouter.post('/signup', register);
authRouter.post('/signin', login);

export default authRouter;
