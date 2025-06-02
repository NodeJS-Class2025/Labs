import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from '../db/connection.js';
import { readJsonFileAsync } from '../utils/files/readJsonFile.js';
import { writeJsonFileAsync } from '../utils/files/writeJsonFile.js';
import { USER_ROLES } from '../constants/userRoles.js';
import Logger from '../utils/logger/logger.js';
import User from '../models/User.model.js';
import { ConflictError, NotFoundError } from '../utils/httpErrors.js';
import DB_ERRORS, { checkDBError } from '../constants/dbErrors.js';

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

  async getUserById(id) {
    const res = await db.query('SELECT * FROM users WHERE id=$1', [id]);
    return res.rows[0] ? new this.UserModel(res.rows[0]) : null;
  }

  async getUserByEmail(email) {
    const res = await db.query('SELECT * FROM users WHERE email=$1', [email]);
    return res.rows[0] ? new this.UserModel(res.rows[0]) : null;
  }

  async getUserByUsername(username) {
    const res = await db.query('SELECT * FROM users WHERE username=$1', [username]);
    return res.rows[0] ? new this.UserModel(res.rows[0]) : null;
  }

  async createUser(user) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const newUser = {
        role: USER_ROLES.USER,
        ...user,
      };

      const queryText = `INSERT INTO users(role, username, email, password, "birthDate") 
				VALUES($1, $2, $3, $4, $5) 
				RETURNING *`;
      const res = await client.query(queryText, [
        newUser.role,
        newUser.username,
        newUser.email,
        newUser.password,
        newUser.birthDate,
      ]);

      await client.query('COMMIT');
      return new this.UserModel(res.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');

      if (checkDBError(err, DB_ERRORS.UNIQUE_CONSTRAINT))
        throw new ConflictError('User with that username or email already exists');

      throw err;
    } finally {
      client.release();
    }
  }

  async updateUser(id, updates) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      updates.updatedAt = new Date();

      const setString = Object.keys(updates)
        .map((key, i) => `"${key}"=$${i + 1}`)
        .join(', ');
      const values = [...Object.values(updates), id];

      const res = await client.query(
        `UPDATE users SET ${setString}
				WHERE id=$${values.length}
				RETURNING *`,
        values,
      );

      await client.query('COMMIT');
      return res.rows[0] ? new this.UserModel(res.rows[0]) : null;
    } catch (err) {
      await client.query('ROLLBACK');

      if (checkDBError(err, DB_ERRORS.UNIQUE_CONSTRAINT))
        throw new ConflictError('User with that username or email already exists');

      throw err;
    } finally {
      client.release();
    }
  }

  async deleteUser(id) {
    // CASCADE deletion
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const res = await client.query('DELETE FROM users WHERE id=$1', [id]);
      await client.query('COMMIT');
      return res.rowCount;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

export default new UserRepository();
