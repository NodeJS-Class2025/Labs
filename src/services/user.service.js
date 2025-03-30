import User from '../models/User.model.js';
import {
  createUser,
  getUserByEmail as getUserByEmailRepo,
} from '../repositories/user.repository.js';
import { getHashedPassword } from '../utils/getHashedPassword.js';

export function verifyUser(user, password) {
  if (!user) {
    return false;
  }
  return user.password === getHashedPassword(password);
}

export function getUserByEmail(email) {
  const user = getUserByEmailRepo(email);
  if (!user) {
    return null;
  }
  return new User(user);
}

export function postUser(user) {
  const newUser = {
    ...user,
    password: getHashedPassword(user.password),
    email: String(user.email).toLowerCase(),
  };
  try {
    const createdUser = new User(createUser(newUser));
    return createdUser;
  } catch (err) {
    throw err;
  }
}
