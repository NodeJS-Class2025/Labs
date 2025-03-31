import { Router } from 'express';
import {
  deleteProfile,
  getProfile,
  patchProfile,
} from '../controllers/user.controller.js';
import { auth } from '../middleware/auth.js';
import { patchProfileValidator } from '../middleware/validators/user.validator.js';

export const userRouter = Router();

userRouter.get('/profile', auth, getProfile);
userRouter.patch('/profile/edit', auth, patchProfileValidator, patchProfile);
userRouter.delete('/profile/delete', auth, deleteProfile);
