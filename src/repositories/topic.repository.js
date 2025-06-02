import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from '../db/connection.js';
import { readJsonFileAsync } from '../utils/files/readJsonFile.js';
import { writeJsonFileAsync } from '../utils/files/writeJsonFile.js';
import Logger from '../utils/logger/logger.js';
import Topic from '../models/Topic.model.js';
import DB_ERRORS, { checkDBError } from '../constants/dbErrors.js';
import { ConflictError, NotFoundError } from '../utils/httpErrors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger();

const topics = [];
const pathToFile = path.resolve(__dirname, '..', 'mock', 'topics.mock.json');

class TopicRepository {
  constructor() {
    this.TopicModel = Topic;
  }

  async readTopics() {
    try {
      const raw = await readJsonFileAsync(pathToFile);
      raw.forEach((t) => topics.push(t));
    } catch (err) {
      logger.error({ err });
    }
  }

  async writeTopics() {
    await writeJsonFileAsync(pathToFile, topics);
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
