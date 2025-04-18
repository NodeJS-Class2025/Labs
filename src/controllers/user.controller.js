import userService from '../services/user.service.js';
import { ProfileOutputDto } from '../dto/account/profile.output.dto.js';
import { ProfileInputDto } from '../dto/account/profile.input.dto.js';

export const getProfile = (req, res) => {
  const user = userService.getUser(parseInt(req.user.userId));
  if (!user) {
    res.clearCookie('jwt');
    return res.redirect('/auth/login');
    // return res.status(401).json({ message: 'User not found' });
  }
  const userRes = new ProfileOutputDto(user);
  return res.render('profile', { user: userRes });
  // return res.status(200).json(userRes);
};

export const patchProfile = (req, res, next) => {
  const userReq = new ProfileInputDto(req.body);
  try {
    const user = userService.patchUser(parseInt(req.user.userId), userReq);
    if (!user) {
      res.clearCookie('jwt');
      return res.redirect('/auth/login');
      // return res.status(401).json({ message: 'User not found' });
    }
    const userRes = new ProfileOutputDto(user);
    return res.render('editProfile', { user: userRes });
    // return res.status(200).json(userRes);
  } catch (err) {
    if (err.name === 'Error') {
      return res.status(400).render('editProfile', { user: userReq, error: err.message });
      // return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

export const deleteProfile = (req, res) => {
  const result = userService.deleteUser(parseInt(req.user.userId));
  if (!result) {
    res.clearCookie('jwt');
    return res.redirect('/auth/login');
    // return res.status(401).json({ message: 'User not found' });
  }
  res.clearCookie('jwt');
  return res.redirect('/auth/login');
  // return res.sendStatus(204);
};

export const patchProfileView = (req, res) => {
  const user = userService.getUser(parseInt(req.user.userId));
  if (!user) {
    res.clearCookie('jwt');
    return res.redirect('/auth/login');
  }
  const userRes = new ProfileOutputDto(user);
  return res.render('editProfile', { user: userRes });
};
