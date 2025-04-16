import userRepository from '../repositories/user.repository.js';
import { getHashedPassword } from '../utils/getHashedPassword.js';

class UserService {
  constructor() {
    this.userRepo = null;
  }

  verifyUser(user, password) {
    if (!user) {
      return false;
    }
    return user.password === getHashedPassword(password);
  }

  getUserByEmail(email) {
    return userRepository.getUserByEmail(email);
  }

  getUser(id) {
    return userRepository.getUserById(id);
  }

  postUser(user) {
    user.password = getHashedPassword(user.password);
    try {
      return userRepository.createUser(user);
    } catch (err) {
      throw err;
    }
  }

  patchUser(id, updates) {
    const resUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    if (updates?.password) {
      resUpdates.password = getHashedPassword(updates.password);
    }
    try {
      return userRepository.updateUser(id, resUpdates);
    } catch (err) {
      throw err;
    }
  }

  deleteUser(id) {
    return userRepository.deleteUser(id);
  }
}

export default new UserService();
