import { Router } from 'express';
import { authRouter } from './auth.route.js';
import { userRouter } from './user.route.js';
import { postRouter } from './post.route.js';
import { topicRouter } from './topic.route.js';

const router = new Router();

router.get('/', (req, res) => {
  return res.redirect('/topics');
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/topics', topicRouter);

export default router;
