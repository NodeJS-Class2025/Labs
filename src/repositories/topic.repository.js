import db from '../db/connection.js';
import Topic from '../models/Topic.model.js';
import DB_ERRORS, { checkDBError } from '../constants/dbErrors.js';
import { ConflictError } from '../utils/httpErrors.js';

class TopicRepository {
  constructor() {
    this.TopicModel = Topic;
  }

  async getAll() {
    const res = await db.query('SELECT * FROM topics');
    return res.rows.map((row) => new this.TopicModel(row));
  }

  async getById(id) {
    const res = await db.query('SELECT * FROM topics WHERE id=$1', [id]);
    return res.rows[0] ? new this.TopicModel(res.rows[0]) : null;
  }

  async createTopic(userId, { title }) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const queryText = `INSERT INTO topics("userId", title) 
				VALUES($1, $2) 
				RETURNING *`;
      const res = await client.query(queryText, [userId, title]);

      await client.query('COMMIT');
      return new this.TopicModel(res.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      if (checkDBError(err, DB_ERRORS.FOREIGN_KEY_CONSTRAINT))
        throw new ConflictError("User doesn't exist");
      throw err;
    } finally {
      client.release();
    }
  }

  async updateTopic(id, { title }) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const updates = { title, updatedAt: new Date() };
      const res = await client.query(
        'UPDATE topics SET title=$1, "updatedAt"=$2 WHERE id=$3 RETURNING *',
        [...Object.values(updates), id],
      );
      await client.query('COMMIT');
      return res.rows[0] ? new this.TopicModel(res.rows[0]) : null;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async deleteTopic(id) {
    // CASCADE deletion
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const res = await client.query('DELETE FROM topics WHERE id=$1', [id]);
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

export default new TopicRepository();
