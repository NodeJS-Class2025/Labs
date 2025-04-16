import jwt from 'jsonwebtoken';
import ms from 'ms';
import userService from '../services/user.service.js';
import { ProfileInputDto } from '../dto/account/profile.input.dto.js';
import { ProfileOutputDto } from '../dto/account/profile.output.dto.js';
import { LoginInputDto } from '../dto/account/login.input.dto.js';

const getToken = (user) => {
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  return token;
}

export const register = async (req, res, next) => {
  const userReq = new ProfileInputDto(req.body);
  try {
    const user = userService.postUser(userReq);

    // const userRes = new ProfileOutputDto(user);

    const token = getToken(user);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: ms(`${process.env.COOKIE_LIFETIME_HOURS}h`),
    });
    return res.redirect('/users/profile');
    // return res.status(201).json(userRes);

  } catch (err) {
    if (err.name === 'Error') {
      return res.render('register', {error: err.message});
      // return res.status(400).json({ message: err.message });
    }
    return next(err);
  }
}

export const login = (req, res) => {
  const { email, password } = new LoginInputDto(req.body);
  const user = userService.getUserByEmail(email);
  if (!userService.verifyUser(user, password)) {
    return res.render('login', {error: 'Invalid email or password'})
    // return res.status(401).json({ message: 'Invalid email or password' });
  }

  const userRes = new ProfileOutputDto(user);

  const token = getToken(user);

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: ms(`${process.env.COOKIE_LIFETIME_HOURS}h`),
  });
  return res.redirect('/users/profile');
  // return res.status(200).json(userRes);
}

export const logout = (req, res) => {
  res.clearCookie('jwt');
  return res.redirect('/auth/login');
  // return res.sendStatus(204);
}

export const registerView = (req, res) => {
  return res.render('register');
}

export const loginView = (req, res) => {
  return res.render('login');
}