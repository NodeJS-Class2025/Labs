import { Router } from 'express';
import {
	getTopics,
	getTopic,
	postTopic,
	patchTopic,
	deleteTopic,
} from '../controllers/topic.controller.js';
import { auth } from '../middleware/auth.js';
import {
	createTopicValidator,
	updateTopicValidator,
} from '../middleware/validators/topic.validator.js';
import { idValidator } from '../middleware/validators/paramsId.validator.js';

export const topicRouter = Router();

topicRouter.get('/', getTopics);
topicRouter.get('/:topicId', idValidator(['topicId']), getTopic);

topicRouter.post('/', auth, createTopicValidator, postTopic);

topicRouter.patch(
	'/:topicId',
	auth,
	idValidator(['topicId']),
	updateTopicValidator,
	patchTopic
);

topicRouter.delete('/:topicId', auth, idValidator(['topicId']), deleteTopic);
