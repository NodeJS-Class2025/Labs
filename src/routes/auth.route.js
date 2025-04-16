import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller.js';
import {
  loginValidator,
  registerValidator,
} from '../middleware/validators/user.validator.js';
import { auth, unAuth } from '../middleware/auth.js';

export const authRouter = Router();

// POST /auth/register (only unauthorized users)
authRouter.post('/register', unAuth, registerValidator, register);

// POST /auth/login (only unauthorized users)
authRouter.post('/login', unAuth, loginValidator, login);

// POST /auth/logout (only authorized users)
authRouter.post('/logout', auth, logout);
