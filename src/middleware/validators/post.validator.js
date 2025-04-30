import Joi from 'joi';

const createPostSchema = Joi.object({
	topicId: Joi.number().integer().positive().required(),
	description: Joi.string().min(1).max(1000).required(),
});

const updatePostSchema = Joi.object({
	description: Joi.string().min(1).max(1000),
})
	.min(1)
	.unknown(false);

export async function createPostValidator(req, res, next) {
	try {
		await createPostSchema.validateAsync(req.body, { abortEarly: false });
	} catch (err) {
		return res.status(400).render('error', { message: err.message });
	}
	next();
}

export async function updatePostValidator(req, res, next) {
	try {
		await updatePostSchema.validateAsync(req.body, { abortEarly: false });
	} catch (err) {
		return res.status(400).render('error', { message: err.message });
	}
	next();
}
