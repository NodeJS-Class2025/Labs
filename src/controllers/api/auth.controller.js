import jwt from 'jsonwebtoken';
import ms from 'ms';
import userService from '../../services/user.service.js';
import { ProfileInputDto } from '../../dto/account/profile.input.dto.js';
import { ProfileOutputDto } from '../../dto/account/profile.output.dto.js';
import { LoginInputDto } from '../../dto/account/login.input.dto.js';

const getToken = (user) => {
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

export const register = async (req, res, next) => {
  const userReq = new ProfileInputDto(req.body);
  try {
    const user = await userService.postUser(userReq);

    const userRes = new ProfileOutputDto(user);

    const token = getToken(user);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: ms(`${process.env.COOKIE_LIFETIME_HOURS}h`),
    });

    return res.status(201).json(userRes);
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = new LoginInputDto(req.body);
  try {
    const user = await userService.getUserByEmail(email);
    userService.verifyUser(user, password);
    const userRes = new ProfileOutputDto(user);

    const token = getToken(user);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: ms(`${process.env.COOKIE_LIFETIME_HOURS}h`),
    });

    return res.status(200).json(userRes);
  } catch (err) {
    return next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie('jwt');
  return res.sendStatus(204);
};
