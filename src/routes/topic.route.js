import { Router } from 'express';
import {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
} from '../controllers/topic.controller.js';
import {
  validateCreateTopic,
  validateUpdateTopic,
} from '../middleware/validators/topic.validator.js';
import { auth, authAdmin } from '../middleware/auth.js';

export const topicRouter = Router();

// GET /topics
topicRouter.get('/', getAllTopics);

// GET /topics/:id
topicRouter.get('/:id', getTopicById);

// POST /topics (only admin)
topicRouter.post('/', authAdmin, validateCreateTopic, createTopic);

// PUT /topics/:id (only admin)
topicRouter.put('/:id', authAdmin, validateUpdateTopic, updateTopic);

// DELETE /topics/:id (only admin)
topicRouter.delete('/:id', authAdmin, deleteTopic);
