import jwt from 'jsonwebtoken';
import ms from 'ms';
import {
  getUserByEmail,
  postUser,
  verifyUser,
} from '../services/user.service.js';

function getToken(user) {
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  return token;
}

export function register(req, res) {
  const user = req.body;
  try {
    const createdUser = postUser(user);

    const token = getToken(createdUser);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: ms(`${process.env.COOKIE_LIFETIME_HOURS}h`),
    });

    res.status(201).json(createdUser);
  } catch (err) {
    if (err.name === 'Error') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export function login(req, res) {
  const { email, password } = req.body;
  const user = getUserByEmail(email);
  if (!verifyUser(user, password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = getToken(user);

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: ms(`${process.env.COOKIE_LIFETIME_HOURS}h`),
  });
  return res.status(201).json(user);
}

export function logout(req, res) {
  res.clearCookie('jwt');
  res.sendStatus(204);
}
