import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJsonFileAsync } from '../utils/files/readJsonFile.js';
import { writeJsonFileAsync } from '../utils/files/writeJsonFile.js';
import { USER_ROLES } from '../constants/userRoles.js';
import Logger from '../utils/logger/logger.js';
import User from '../models/User.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger();

const users = [];
const pathToFile = path.resolve(__dirname, '..', 'mock', 'users.mock.json');

class UserRepository {
  constructor() {
    this.UserModel = User;
  }

  async readUsers() {
    try {
      const rawData = await readJsonFileAsync(pathToFile);

      rawData.forEach((user) => {
        // users.push(new this.UserModel(user));
        users.push(user);
      });
    } catch (err) {
      logger.error({ err });
    }
  }

  async writeUsers() {
    try {
      await writeJsonFileAsync(pathToFile, users);
    } catch (err) {
      throw err;
    }
  }

  _findUserById(id) {
    return users.find((user) => user.id === id);
  }

  _findUserByEmail(email) {
    return users.find((user) => user.email === email);
  }

  _findUserByUsername(username) {
    return users.find((user) => user.username === username);
  }

  getUserByEmail(email) {
    const user = this._findUserByEmail(email);
    if (!user) {
      return null;
    }
    return new this.UserModel(user);
  }

  getUserById(id) {
    const user = this._findUserById(id);
    if (!user) {
      return null;
    }
    return new this.UserModel(user);
  }

  createUser(user) {
    if (this._findUserByUsername(user.username)) {
      throw new Error('User with that username already exists');
    }
    if (this._findUserByEmail(user.email)) {
      throw new Error('User with that email already exists');
    }

    const now = new Date().toISOString();
    const createdUser = {
      id: users.length + 1,
      role: USER_ROLES.USER,
      ...user,
      createdAt: now,
      updatedAt: now,
    };
    users.push(createdUser);
    return new this.UserModel(createdUser);
  }

  updateUser(id, updates) {
    if (
      updates?.username &&
      users.find((user) => user.username === updates.username && user.id !== id)
    ) {
      throw new Error('User with that username already exists');
    }
    if (
      updates?.email &&
      users.find((user) => user.email === updates.email && user.id !== id)
    ) {
      throw new Error('User with that email already exists');
    }

    const user = this._findUserById(id);
    if (!user) {
      return null;
    }
    updates.updatedAt = new Date().toISOString();
    return new this.UserModel(Object.assign(user, updates));
  }

  deleteUser(id) {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return false;
    }
    users.splice(userIndex, 1);
    return true;
  }
}

export default new UserRepository();
