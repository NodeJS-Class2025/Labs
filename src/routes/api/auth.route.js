import { Router } from 'express';
import { auth, unAuth } from '../../middleware/api/auth.js';
import {
  loginValidator,
  registerValidator,
} from '../../middleware/api/validators/user.validator.js';
import { login, logout, register } from '../../controllers/api/auth.controller.js';

const apiAuthRouter = Router();

// POST /auth/register (only unauthorized users)
apiAuthRouter.post('/register', unAuth, registerValidator, register);

// POST /auth/login (only unauthorized users)
apiAuthRouter.post('/login', unAuth, loginValidator, login);

// POST /auth/logout (only authorized users)
apiAuthRouter.post('/logout', auth, logout);

export default apiAuthRouter;
