import { Router } from 'express';
import { authRouter } from './auth.route';

const router = new Router();

router.use('auth', authRouter);

export default router;
