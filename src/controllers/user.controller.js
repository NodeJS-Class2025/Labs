import userService from '../services/user.service.js';
import { ProfileOutputDto } from '../dto/account/profile.output.dto.js';
import { ProfileInputDto } from '../dto/account/profile.input.dto.js';
import { HttpError, NotFoundError } from '../utils/httpErrors.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUser(parseInt(req.user.userId));
    const userRes = new ProfileOutputDto(user);

    return res.render('profile', { user: userRes });
    // return res.status(200).json(userRes);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.clearCookie('jwt');
      return res.redirect('/auth/login');
      // return res.status(401).json({ message: 'User not found' });
    }
    next(err);
  }
};

export const patchProfile = async (req, res, next) => {
  const userReq = new ProfileInputDto(req.body);
  try {
    const user = await userService.patchUser(parseInt(req.user.userId), userReq);
    const userRes = new ProfileOutputDto(user);

    return res.render('editProfile', { user: userRes });
    // return res.status(200).json(userRes);
  } catch (err) {
    if (err instanceof HttpError) {
      if (err instanceof NotFoundError) {
        res.clearCookie('jwt');
        return res.redirect('/auth/login');
        // return res.status(401).json({ message: 'User not found' });
      }
      return res
        .status(err.statusCode)
        .render('editProfile', { user: userReq, error: err.message });
      // return res.status(400).json({ message: err.message });
    }

    return next(err);
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    await userService.deleteUser(parseInt(req.user.userId));
    res.clearCookie('jwt');
    return res.redirect('/auth/login');
    // return res.sendStatus(204);
  } catch (err) {
    if (err instanceof HttpError) {
      if (err instanceof NotFoundError) {
        res.clearCookie('jwt');
        return res.redirect('/auth/login');
        // return res.status(401).json({ message: 'User not found' });
      }
    }
    next(err);
  }
};

export const patchProfileView = async (req, res, next) => {
  try {
    const user = await userService.getUser(parseInt(req.user.userId));
    const userRes = new ProfileOutputDto(user);

    return res.render('editProfile', { user: userRes });
  } catch (err) {
    if (err instanceof HttpError) {
      if (err instanceof NotFoundError) {
        res.clearCookie('jwt');
        return res.redirect('/auth/login');
      }
    }
    next(err);
  }
};
