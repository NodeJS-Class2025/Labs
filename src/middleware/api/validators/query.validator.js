import Joi from 'joi';

const queryPageSchema = Joi.number().integer().positive().required().label('Query page');

export async function validateQueryPage(req, res, next) {
  try {
    await queryPageSchema.validateAsync(req.query.page, { abortEarly: false });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
      details: err.details.map((d) => d.message),
    });
  }
  next();
}
