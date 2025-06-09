import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { idValidator } from '../../middleware/api/validators/paramsId.validator.js';
import {
  deletePost,
  getPost,
  getPosts,
  getPostsByTopic,
  patchPost,
  postPost,
} from '../../controllers/api/post.controller.js';
import { updatePostValidator } from '../../middleware/api/validators/post.validator.js';
import { validateQueryPage } from '../../middleware/api/validators/query.validator.js';

const apiPostRouter = Router();

apiPostRouter.get('/', validateQueryPage, getPosts);

apiPostRouter.get('/:postId', idValidator(['postId']), getPost);

apiPostRouter.get('/topic/:topicId', validateQueryPage, idValidator(['topicId']), getPostsByTopic);

apiPostRouter.post('/topic/:topicId', auth, idValidator(['topicId']), postPost);

apiPostRouter.patch('/:postId', auth, idValidator(['postId']), updatePostValidator, patchPost);

apiPostRouter.delete('/:postId', auth, idValidator(['postId']), deletePost);

export default apiPostRouter;
