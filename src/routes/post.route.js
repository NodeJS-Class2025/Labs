import { Router } from 'express';
import {
	getPosts,
	getPost,
	  getPostsByTopic,
	postPost,
	patchPost,
	deletePost,
} from '../controllers/post.controller.js';
import { auth } from '../middleware/auth.js';
import {
	createPostValidator,
	updatePostValidator,
} from '../middleware/validators/post.validator.js';
import { idValidator } from '../middleware/validators/paramsId.validator.js';

export const postRouter = Router();

postRouter.get('/', getPosts);
postRouter.get('/:postId', idValidator(['postId']), getPost);
postRouter.get('/topic/:topicId', idValidator(['topicId']), getPostsByTopic);

postRouter.post('/topic/:topicId', postPost);


postRouter.patch(
	'/:postId',
	auth,
	idValidator(['postId']),
	updatePostValidator,
	patchPost
);

postRouter.delete('/:postId', auth, idValidator(['postId']), deletePost);
