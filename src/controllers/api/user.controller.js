import userService from '../../services/user.service.js';
import { ProfileOutputDto } from '../../dto/account/profile.output.dto.js';
import { ProfileInputDto } from '../../dto/account/profile.input.dto.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUser(parseInt(req.user.userId));
    const userRes = new ProfileOutputDto(user);

    return res.status(200).json(userRes);
  } catch (err) {
    next(err);
  }
};

export const patchProfile = async (req, res, next) => {
  const userReq = new ProfileInputDto(req.body);
  try {
    const user = await userService.patchUser(parseInt(req.user.userId), userReq);
    const userRes = new ProfileOutputDto(user);

    return res.status(200).json(userRes);
  } catch (err) {
    return next(err);
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    await userService.deleteUser(parseInt(req.user.userId));
    res.clearCookie('jwt');
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
