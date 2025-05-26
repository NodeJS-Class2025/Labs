import postService from '../services/post.service.js';
import { CreatePostDto } from '../dto/post/createPost.dto.js';
import { UpdatePostDto } from '../dto/post/updatePost.dto.js';

export const getPosts = (req, res) => {
	return res.status(200).json(postService.getAllPosts());
};

export const getPost = (req, res) => {
	const post = postService.getPost(parseInt(req.params.postId));
	if (!post) {
		return res.status(404).json({ message: 'Post not found' });
	}
	return res.status(200).json(post);
};

export const getPostsByTopic = (req, res) => {
	const posts = postService.getPostsByTopic(parseInt(req.params.topicId));
	return res.status(200).json(posts);
};

export const postPost = (req, res, next) => {
	const dto = new CreatePostDto(req.body, req.params.topicId);
	try {
		const post = postService.createPost(req.user.userId, dto);
		// return res.status(201).json(post);
		return res.redirect(`/topics/${req.params.topicId}`);
	} catch (err) {
		if (err.message === 'Topic not found') {
			return res.status(404).json({ message: err.message });
		}
		next(err);
	}
};

export const renderNewPost = async (req, res) => {
	const topicId = parseInt(req.params.topicId);
	res.render('new-post', { topicId, topicTitle: 'Нова тема' });
};

export const renderNewPostForm = async (req, res, next) => {
	try {
		const topicId = parseInt(req.params.topicId);
		res.render('new-post', { topicId });
	} catch (err) {
		next(err);
	}
};

export const patchPost = (req, res, next) => {
	const dto = new UpdatePostDto(req.body);
	try {
		const post = postService.updatePost(
			req.user,
			parseInt(req.params.postId),
			dto
		);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}
		return res.status(200).json(post);
	} catch (err) {
		if (err.message === 'Forbidden') {
			return res.status(403).json({ message: 'Forbidden' });
		}
		next(err);
	}
};

export const deletePost = (req, res, next) => {
	try {
		const result = postService.deletePost(
			req.user,
			parseInt(req.params.postId)
		);
		if (result === null) {
			return res.status(404).json({ message: 'Post not found' });
		}
		return res.sendStatus(204);
	} catch (err) {
		if (err.message === 'Forbidden') {
			return res.status(403).json({ message: 'Forbidden' });
		}
		next(err);
	}
};
