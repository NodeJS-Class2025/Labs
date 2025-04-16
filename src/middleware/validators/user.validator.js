import Joi from 'joi';

const registerSchema = Joi.object({
  username: Joi.string().pattern(/^\S+$/).min(4).max(30).required().messages({
    'string.pattern.base': '{#label} must not contain spaces',
  }),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(/^\S+$/).min(4).max(40).required().messages({
    'string.pattern.base': '{#label} must not contain spaces',
  }),
  birthDate: Joi.date().iso().min('1900-01-01').max('now').required().messages({
    'date.max': '{#label} cannot be in the future',
    'date.min': '{#label} must be greater than or equal to "1900-01-01"',
    'date.format': '{#label} must be in ISO 8601 (YYYY-MM-DD) format',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(/^\S+$/).min(4).max(40).required().messages({
    'string.pattern.base': '{#label} must not contain spaces',
  }),
});

const patchProfileSchema = Joi.object({
  username: Joi.string().pattern(/^\S+$/).min(4).max(30).messages({
    'string.pattern.base': '{#label} must not contain spaces',
  }),
  email: Joi.string().email(),
  password: Joi.string().pattern(/^\S+$/).min(4).max(40).messages({
    'string.pattern.base': '{#label} must not contain spaces',
  }),
  birthDate: Joi.date().iso().min('1900-01-01').max('now').messages({
    'date.max': '{#label} cannot be in the future',
    'date.min': '{#label} must be greater than or equal to "1900-01-01"',
    'date.format': '{#label} must be in ISO 8601 (YYYY-MM-DD) format',
  }),
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
    return res.render('register', {error: err.message});
    // return res.status(400).json({
    //   error: err.message,
    //   details: err.details.map((d) => d.message),
    // });
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
    return res.render('login', {error: err.message});
    // return res.status(400).json({
    //   error: err.message,
    //   details: err.details.map((d) => d.message),
    // });
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
    return res.redirect(`/users/profile/edit?error=${err.message}`)
    // return res.status(400).json({
    //   error: err.message,
    //   details: err.details.map((d) => d.message),
    // });
  }
  next();
}
