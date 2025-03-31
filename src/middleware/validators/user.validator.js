import Joi from 'joi';

const registerSchema = Joi.object({
  username: Joi.string().min(4).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(40).required(),
  birthDate: Joi.date().iso().required(), // testing
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(40).required(),
});

const patchProfileSchema = Joi.object({
  username: Joi.string().min(4).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(4).max(40),
  birthDate: Joi.date().iso(),
})
  .min(1)
  .unknown(false);

export async function registerValidator(req, res, next) {
  try {
    await registerSchema.validateAsync(req.body, {
      allowUnknown: false,
      abortEarly: false,
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
      details: err.details.map((d) => d.message),
    });
  }
  next();
}

export async function loginValidator(req, res, next) {
  try {
    await loginSchema.validateAsync(req.body, {
      allowUnknown: false,
      abortEarly: false,
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
      details: err.details.map((d) => d.message),
    });
  }
  next();
}

export async function patchProfileValidator(req, res, next) {
  try {
    await patchProfileSchema.validateAsync(req.body, {
      allowUnknown: false,
      abortEarly: false,
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
      details: err.details.map((d) => d.message),
    });
  }
  next();
}
