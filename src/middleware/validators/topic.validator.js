import Joi from 'joi';

const createTopicSchema = Joi.object({
	title: Joi.string().min(3).max(100).required(),
	description: Joi.string().min(10).max(500).required(),
});

const updateTopicSchema = Joi.object({
	title: Joi.string().min(3).max(100),
	description: Joi.string().min(10).max(500),
}).min(1);

export async function validateCreateTopic(req, res, next) {
	try {
		await createTopicSchema.validateAsync(req.body, {
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

export async function validateUpdateTopic(req, res, next) {
	try {
		await updateTopicSchema.validateAsync(req.body, {
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
