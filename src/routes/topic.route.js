import { Router } from 'express';
import {
  getTopics,
  getTopic,
  postTopic,
  patchTopic,
  deleteTopic,
  postTopicView,
  postPostForTopicView,
} from '../controllers/topic.controller.js';
import { auth, authAdmin } from '../middleware/auth.js';
import {
  createTopicValidator,
  updateTopicValidator,
} from '../middleware/validators/topic.validator.js';
import { idValidator } from '../middleware/validators/paramsId.validator.js';
import topicService from '../services/topic.service.js';

export const topicRouter = Router();

topicRouter.get('/', getTopics);

topicRouter.get('/create-topic', authAdmin, postTopicView);

topicRouter.get('/:topicId', idValidator(['topicId']), getTopic);

topicRouter.get('/:topicId/create-post', auth, idValidator(['topicId']), postPostForTopicView);

topicRouter.post('/', authAdmin, createTopicValidator, postTopic);

// ONLY FOR TEST ROLLBACK
topicRouter.post('/with-first-post', auth, async (req, res, next) => {
  try {
    const topic = await topicService.createTopicWithFirstPost(req.user.userId, {
      title: req.body.title,
      description: req.body.description,
    });
    res.status(201).json(topic);
  } catch (e) {
    console.log(req.user.userId, req.body);
    next(e);
  }
});
//

topicRouter.patch(
  '/:topicId',
  authAdmin,
  idValidator(['topicId']),
  updateTopicValidator,
  patchTopic,
);

topicRouter.delete('/:topicId', authAdmin, idValidator(['topicId']), deleteTopic);
