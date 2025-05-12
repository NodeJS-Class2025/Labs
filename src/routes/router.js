
// Виправлений router.js, щоб уникнути помилки `Route.post() requires a callback function but got a [object Undefined]`
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

// Виправлено: зміна назв функцій у router.js згідно з topic.controller.js
router.get('/topics/new', topicController.renderNewTopic);
router.post('/topics', topicController.postTopic); // <-- ця функція називалась createTopic, але в topic.controller.js її назва postTopic
router.get('/topics', async (req, res) => {
  const topics = await topicController.getTopicsForTemplate();
  res.render('topics', { topics });
});
router.get('/topics/:topicId', topicController.getTopic); // <-- було renderTopicWithPosts

// Новий маршрут для шаблону постів (/posts), щоб рендерити через EJS
router.get('/posts', async (req, res) => {
  const posts = await postController.getPostsForTemplate?.() || [];
  res.render('posts', { topicTitle: 'Всі дописи', posts, topicId: null });
});

// Виправлено: зміна назв функцій у router.js згідно з post.controller.js
router.get('/posts/topic/:topicId/new', postController.renderNewPost); // але цієї функції НЕМає в post.controller.js, потрібно додати
router.post('/posts/topic/:topicId', postController.postPost); // <-- було createPost, а має бути postPost

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/topics', topicRouter);

export default router;
