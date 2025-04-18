import { Router } from 'express';
import {
  deleteProfile,
  getProfile,
  patchProfile,
  patchProfileView,
} from '../controllers/user.controller.js';
import { auth } from '../middleware/auth.js';
import { patchProfileValidator } from '../middleware/validators/user.validator.js';

export const userRouter = Router();

// GET /users/profile (only authorized users)
userRouter.get('/profile', auth, getProfile);

// PATCH /users/profile/edit (only authorized users)
userRouter.patch('/profile', auth, patchProfileValidator, patchProfile);

// DELETE /users/profile (only authorized users)
userRouter.delete('/profile', auth, deleteProfile);

// GET /users/profile/edit (only authorized users)
userRouter.get('/profile/edit', auth, patchProfileView);
