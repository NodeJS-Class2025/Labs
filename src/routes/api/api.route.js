import { Router } from 'express';
import apiAuthRouter from './auth.route.js';
import apiUserRouter from './user.route.js';
import apiPostRouter from './post.route.js';
import apiTopicRouter from './topic.route.js';
import { apiErrorHandler } from '../../middleware/api/errorHandler.js';

const apiRouter = Router();

apiRouter.use('/auth', apiAuthRouter);
apiRouter.use('/users', apiUserRouter);
apiRouter.use('/posts', apiPostRouter);
apiRouter.use('/topics', apiTopicRouter);

apiRouter.use((req, res, next) => {
  return res.status(404).json({ message: 'Not Found' });
});

apiRouter.use(apiErrorHandler);

export default apiRouter;
