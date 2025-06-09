import Joi from 'joi';
import { createTopicSchema, updateTopicSchema } from '../../validators/topic.validator.js';

const categorySchema = Joi.string().trim().min(1).label('Query category');

export async function TopicCategoryValidator(req, res, next) {
  try {
    await categorySchema.validateAsync(req.query.category, { abortEarly: false });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
      details: err.details.map((d) => d.message),
    });
  }
  next();
}

export async function createTopicValidator(req, res, next) {
  try {
    await createTopicSchema.validateAsync(req.body, { abortEarly: false });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
      details: err.details.map((d) => d.message),
    });
  }
  next();
}

export async function updateTopicValidator(req, res, next) {
  try {
    await updateTopicSchema.validateAsync(req.body, { abortEarly: false });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
      details: err.details.map((d) => d.message),
    });
  }
  next();
}
