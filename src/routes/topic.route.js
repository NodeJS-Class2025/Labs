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

export const topicRouter = Router();

topicRouter.get('/', getTopics);

topicRouter.get('/create-topic', authAdmin, postTopicView);

topicRouter.get('/:topicId', idValidator(['topicId']), getTopic);

topicRouter.get(
	'/:topicId/create-post',
	auth,
	idValidator(['topicId']),
	postPostForTopicView
);

topicRouter.post('/', authAdmin, createTopicValidator, postTopic);

topicRouter.patch(
	'/:topicId',
	authAdmin,
	idValidator(['topicId']),
	updateTopicValidator,
	patchTopic
);

topicRouter.delete(
	'/:topicId',
	authAdmin,
	idValidator(['topicId']),
	deleteTopic
);
