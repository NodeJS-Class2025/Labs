import { Router } from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';
import {
  validateCreatePost,
  validateUpdatePost,
} from '../middleware/validators/post.validator.js';
import { auth, authUser } from '../middleware/auth.js';

export const postRouter = Router();

// GET /posts
postRouter.get('/', getAllPosts);

// GET /posts/:id
postRouter.get('/:id', getPostById);

// POST /posts (only registered users)
postRouter.post('/', auth, validateCreatePost, createPost);

// PUT /posts/:id (only registered users)
postRouter.put('/:id', auth, validateUpdatePost, updatePost);

// DELETE /posts/:id (only registered users)
postRouter.delete('/:id', auth, deletePost);
