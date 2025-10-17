import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  getProfile,
  updateUser,
  updateAvatar,
} from '../controllers/users';
import { validateAvatar, validateUpdateUser, validateUserId } from '../middleware/validate';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/me', getProfile);
userRouter.get('/:userId', validateUserId, getUserById);
userRouter.patch('/me', validateUpdateUser, updateUser);
userRouter.patch('/me/avatar', validateAvatar, updateAvatar);

export default userRouter;
