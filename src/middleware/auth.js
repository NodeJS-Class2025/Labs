import jwt from 'jsonwebtoken';
import { USER_ROLES } from '../constants/userRoles.js';

export function unAuth(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return next();
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next();
  }
  res.status(403).json({ message: 'Forbidden: already authenticated user' });
}

export function auth(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'Missed token' });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }

  next();
}

export function authAdmin(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'Missed token' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== USER_ROLES.ADMIN) {
      res
        .status(403)
        .json({ message: 'Forbidden: administrative access required.' });
    }
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
  next();
}
