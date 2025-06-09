import { createPostSchema, updatePostSchema } from '../../validators/post.validator.js';

export async function createPostValidator(req, res, next) {
  try {
    await createPostSchema.validateAsync(req.body, { abortEarly: false });
  } catch (err) {
		return res.status(400).json({
      error: err.message,
      details: err.details.map((d) => d.message),
    });
  }
  next();
}

export async function updatePostValidator(req, res, next) {
  try {
    await updatePostSchema.validateAsync(req.body, { abortEarly: false });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
      details: err.details.map((d) => d.message),
    });
  }
  next();
}
