import Joi from 'joi';

const createPostSchema = Joi.object({
	topicId: Joi.string().uuid().required(),
	content: Joi.string().min(10).max(1000).required(),
	authorId: Joi.string().uuid().required(),
});

const updatePostSchema = Joi.object({
	content: Joi.string().min(10).max(1000),
}).min(1);

export async function validateCreatePost(req, res, next) {
	try {
		await createPostSchema.validateAsync(req.body, {
			allowUnknown: false,
			abortEarly: false,
		});
		next();
	} catch (err) {
		return res.status(400).json({
			error: err.message,
			details: err.details.map((d) => d.message),
		});
	}
}

export async function validateUpdatePost(req, res, next) {
	try {
		await updatePostSchema.validateAsync(req.body, {
			allowUnknown: false,
			abortEarly: false,
		});
		next();
	} catch (err) {
		return res.status(400).json({
			error: err.message,
			details: err.details.map((d) => d.message),
		});
	}
}
