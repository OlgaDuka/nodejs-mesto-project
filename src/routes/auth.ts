import { Router } from 'express';
import { login, register } from '../controllers/auth';
import { validateSignin, validateSignup } from '../middleware/validate';

const authRouter = Router();

authRouter.post('/signup', validateSignup, register);
authRouter.post('/signin', validateSignin, login);

export default authRouter;
