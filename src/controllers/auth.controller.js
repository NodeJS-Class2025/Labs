import jwt from 'jsonwebtoken';
import ms from 'ms';
import {
  getUserByEmail,
  postUser,
  verifyUser,
} from '../services/user.service.js';
import { ProfileInputDto } from '../dto/account/profile.input.dto.js';
import { ProfileOutputDto } from '../dto/account/profile.output.dto.js';
import { LoginInputDto } from '../dto/account/login.input.dto.js';

function getToken(user) {
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  return token;
}

export async function register(req, res, next) {
  const userReq = new ProfileInputDto(req.body);
  try {
    const user = postUser(userReq);

    const userRes = new ProfileOutputDto(user);

    const token = getToken(user);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: ms(`${process.env.COOKIE_LIFETIME_HOURS}h`),
    });

    res.status(201).json(userRes);
  } catch (err) {
    if (err.name === 'Error') {
      return res.status(400).json({ message: err.message });
    }
    return next(err);
  }
}

export function login(req, res) {
  const { email, password } = new LoginInputDto(req.body);
  const user = getUserByEmail(email);
  if (!verifyUser(user, password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const userRes = new ProfileOutputDto(user);

  const token = getToken(user);

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: ms(`${process.env.COOKIE_LIFETIME_HOURS}h`),
  });
  return res.status(200).json(userRes);
}

export function logout(req, res) {
  res.clearCookie('jwt');
  res.sendStatus(204);
}
