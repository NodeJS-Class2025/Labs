import postService from '../services/post.service.js';
import { CreatePostDto } from '../dto/post/createPost.dto.js';
import { UpdatePostDto } from '../dto/post/updatePost.dto.js';
import { ConflictError, HttpError, NotFoundError } from '../utils/httpErrors.js';

export const getPosts = async (req, res) => {
  return res.status(200).json(await postService.getAllPosts());
};

export const getPost = async (req, res, next) => {
  try {
    const post = await postService.getPost(parseInt(req.params.postId));
    return res.status(200).json(post);
  } catch (err) {
    if (err instanceof HttpError) return res.status(err.statusCode).json({ message: err.message });
    next(err);
  }
};

export const getPostsByTopic = async (req, res) => {
  const posts = await postService.getPostsByTopic(parseInt(req.params.topicId));
  return res.status(200).json(posts);
};

export const postPost = async (req, res, next) => {
  const dto = new CreatePostDto(req.body, req.params.topicId);
  try {
    const post = await postService.createPost(req.user.userId, dto);
    // return res.status(201).json(post);
    return res.redirect(`/topics/${req.params.topicId}`);
  } catch (err) {
    if (err instanceof HttpError) {
      if (err instanceof ConflictError && err.message.includes('User')) {
        res.clearCookie('jwt');
        return res.redirect('/auth/login');
      }
      return res.status(err.statusCode).json({ message: err.message });
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

export const patchPost = async (req, res, next) => {
  const dto = new UpdatePostDto(req.body);
  try {
    const post = await postService.updatePost(req.user, parseInt(req.params.postId), dto);
    return res.status(200).json(post);
  } catch (err) {
    if (err instanceof HttpError) {
      if (err instanceof NotFoundError && err.message.includes('User')) {
        res.clearCookie('jwt');
        return res.redirect('/auth/login');
      }
      return res.status(err.statusCode).json({ message: err.message });
    }
    // return res.status(403).json({ message: 'Forbidden' });
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.user, parseInt(req.params.postId));
    return res.sendStatus(204);
  } catch (err) {
    if (err instanceof HttpError) {
      if (err instanceof NotFoundError && err.message.includes('User')) {
        res.clearCookie('jwt');
        return res.redirect('/auth/login');
      }
      return res.status(err.statusCode).json({ message: err.message });
    }
    // return res.status(403).json({ message: 'Forbidden' });
    next(err);
  }
};
