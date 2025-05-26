import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller.js';
import {
	loginValidator,
	registerValidator,
} from '../middleware/validators/user.validator.js';
import { auth, unAuth } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/register', unAuth, registerValidator, register);
authRouter.post('/login', unAuth, loginValidator, login);
authRouter.post('/logout', auth, logout);
