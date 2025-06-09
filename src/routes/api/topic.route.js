import { Router } from 'express';
import { authAdmin } from '../../middleware/api/auth.js';
import { idValidator } from '../../middleware/api/validators/paramsId.validator.js';
import {
  createTopicValidator,
  TopicCategoryValidator,
  updateTopicValidator,
} from '../../middleware/api/validators/topic.validator.js';
import {
  getTopic,
  getTopics,
  patchTopic,
  postTopic,
} from '../../controllers/api/topic.controller.js';
import { validateQueryPage } from '../../middleware/api/validators/query.validator.js';

const apiTopicRouter = Router();

apiTopicRouter.get('/', validateQueryPage, TopicCategoryValidator, getTopics);

apiTopicRouter.get('/:topicId', idValidator(['topicId']), getTopic);

apiTopicRouter.post('/', authAdmin, createTopicValidator, postTopic);

apiTopicRouter.patch(
  '/:topicId',
  authAdmin,
  idValidator(['topicId']),
  updateTopicValidator,
  patchTopic,
);

export default apiTopicRouter;
