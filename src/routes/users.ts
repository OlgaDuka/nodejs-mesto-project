import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  getProfile,
  updateUser,
  updateAvatar,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/me', getProfile);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);

export default userRouter;
