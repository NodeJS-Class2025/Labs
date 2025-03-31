import jwt from 'jsonwebtoken';
import { deleteUser, getUser, patchUser } from '../services/user.service.js';

export function getProfile(req, res) {
  const token = req.cookies.jwt;
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = getUser(parseInt(payload.userId));
  if (!user) {
    res.clearCookie('jwt');
    return res.status(401).json({ message: 'User not found' });
  }
  return res.status(200).json(user);
}

export function patchProfile(req, res, next) {
  const token = req.cookies.jwt;
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const user = patchUser(parseInt(payload.userId), req.body);
    if (!user) {
      res.clearCookie('jwt');
      return res.status(401).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'Error') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
}

export function deleteProfile(req, res) {
  const token = req.cookies.jwt;
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const result = deleteUser(parseInt(payload.userId));
  if (!result) {
    res.clearCookie('jwt');
    return res.status(401).json({ message: 'User not found' });
  }
  res.clearCookie('jwt');
  return res.sendStatus(204);
}
