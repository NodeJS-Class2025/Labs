import Joi from 'joi';

export const createTopicSchema = Joi.object({
  title: Joi.string().min(4).max(150).required(),
  category: Joi.string().trim().max(50).required(),
});

export const updateTopicSchema = Joi.object({
  title: Joi.string().min(4).max(150),
})
  .min(1)
  .unknown(false);

export async function createTopicValidator(req, res, next) {
  try {
    await createTopicSchema.validateAsync(req.body, { abortEarly: false });
  } catch (err) {
    return res.status(400).render('error', { message: err.message });
  }
  next();
}

export async function updateTopicValidator(req, res, next) {
  try {
    await updateTopicSchema.validateAsync(req.body, { abortEarly: false });
  } catch (err) {
    return res.status(400).render('error', { message: err.message });
  }
  next();
}
