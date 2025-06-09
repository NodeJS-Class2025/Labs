import postService from '../../services/post.service.js';
import { CreatePostDto } from '../../dto/post/createPost.dto.js';
import { UpdatePostDto } from '../../dto/post/updatePost.dto.js';

export const getPosts = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  return res.status(200).json(await postService.getAllPosts(page));
};

export const getPost = async (req, res, next) => {
  try {
    const post = await postService.getPost(parseInt(req.params.postId));
    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

export const getPostsByTopic = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const posts = await postService.getPostsByTopic(parseInt(req.params.topicId), page);
  return res.status(200).json(posts);
};

export const postPost = async (req, res, next) => {
  const dto = new CreatePostDto(req.body, req.params.topicId);
  try {
    const post = await postService.createPost(req.user.userId, dto);
    return res.status(201).json(post);
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
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.user, parseInt(req.params.postId));
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
