import User from '../models/User.model.js';
import {
  createUser,
  getUserByEmail as getUserByEmailRepo,
  getUserById,
  updateUser,
  deleteUser as deleteUserRepo,
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

export function getUser(id) {
  const user = getUserById(id);
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

export function patchUser(id, updates) {
  const resUpdates = { ...updates };
  if (updates?.email) {
    resUpdates.email = updates.email.toLowerCase();
  }
  if (updates?.password) {
    resUpdates.password = getHashedPassword(updates.password);
  }
  try {
    const user = updateUser(id, resUpdates);
    if (!user) {
      return null;
    }
    return new User(user);
  } catch (err) {
    throw err;
  }
}

export function deleteUser(id) {
  return deleteUserRepo(id);
}
