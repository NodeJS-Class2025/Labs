import userRepository from '../repositories/user.repository.js';
import { getHashedPassword } from '../utils/getHashedPassword.js';
import { NotFoundError, UnauthorizedError } from '../utils/httpErrors.js';

class UserService {
  constructor() {
    this.userRepo = null;
  }

  verifyUser(user, password) {
    if (!user || user.password !== getHashedPassword(password))
      throw new UnauthorizedError('Invalid email or password');
  }

  async getUserByEmail(email) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async getUser(id) {
    const user = await userRepository.getUserById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async postUser(user) {
    user.password = getHashedPassword(user.password);
    return await userRepository.createUser(user);
  }

  async patchUser(id, updates) {
    const resUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined),
    );
    if (updates?.password) {
      resUpdates.password = getHashedPassword(updates.password);
    }
    const user = await userRepository.updateUser(id, resUpdates);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async deleteUser(id) {
    const rowsCount = await userRepository.deleteUser(id);
    if (!rowsCount) throw new NotFoundError('User not found');
  }
}

export default new UserService();
