import Joi from 'joi';
import {
  registerSchema,
  loginSchema,
  patchProfileSchema,
} from '../../validators/user.validator.js';


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
