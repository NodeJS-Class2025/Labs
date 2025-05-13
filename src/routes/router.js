
import { Router } from 'express';
import { authRouter } from './auth.route.js';
import { userRouter } from './user.route.js';
import { postRouter } from './post.route.js';
import { topicRouter } from './topic.route.js';
import * as topicController from '../controllers/topic.controller.js';
import * as postController from '../controllers/post.controller.js';

const router = new Router();

router.get('/', (req, res) => {
  return res.render('index');
});

router.get('/topics/new', topicController.renderNewTopic);
router.post('/topics', topicController.postTopic);
router.get('/topics', async (req, res) => {
  const topics = await topicController.getTopicsForTemplate();
  res.render('topics', { topics });
});
router.get('/topics/:topicId', topicController.getTopic);

router.get('/posts', async (req, res) => {
  const posts = await postController.getPostsForTemplate?.() || [];
  res.render('posts', { topicTitle: 'Всі дописи', posts, topicId: null });
});

router.get('/posts/topic/:topicId/new', postController.renderNewPost);
router.post('/posts/topic/:topicId', postController.postPost);

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/topics', topicRouter);

export default router;
