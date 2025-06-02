import db from '../db/connection.js';
import { USER_ROLES } from '../constants/userRoles.js';
import User from '../models/User.model.js';
import { ConflictError } from '../utils/httpErrors.js';
import DB_ERRORS, { checkDBError } from '../constants/dbErrors.js';

class UserRepository {
  constructor() {
    this.UserModel = User;
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
