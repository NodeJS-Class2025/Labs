import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJsonFileAsync } from '../utils/files/readJsonFile.js';
import { writeJsonFileAsync } from '../utils/files/writeJsonFile.js';
import Logger from '../utils/logger/logger.js';
import Post from '../models/Post.model.js';
import db from '../db/connection.js';
import { ConflictError } from '../utils/httpErrors.js';
import DB_ERRORS, { checkDBError } from '../constants/dbErrors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger();

const posts = [];
const pathToFile = path.resolve(__dirname, '..', 'mock', 'posts.mock.json');

class PostRepository {
  constructor() {
    this.PostModel = Post;
  }

  async readPosts() {
    try {
      const raw = await readJsonFileAsync(pathToFile);
      raw.forEach((p) => posts.push(p));
    } catch (err) {
      logger.error({ err });
    }
  }

  async writePosts() {
    await writeJsonFileAsync(pathToFile, posts);
  }

  async getAll() {
    const res = await db.query('SELECT * FROM posts');
    return res.rows.map((row) => new this.PostModel(row));
  }

  async getById(id) {
    const res = await db.query('SELECT * FROM posts WHERE id=$1', [id]);
    return res.rows[0] ? new this.PostModel(res.rows[0]) : null;
  }

  async getByTopic(topicId) {
    const res = await db.query('SELECT * FROM posts WHERE "topicId"=$1', [topicId]);
    return res.rows.map((row) => new this.PostModel(row));
  }

  async createPost(userId, { topicId, description }) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const queryText = `INSERT INTO posts("userId", "topicId", description) 
				VALUES($1, $2, $3) 
				RETURNING *`;
      const res = await client.query(queryText, [userId, topicId, description]);

      await client.query('COMMIT');
      return new this.PostModel(res.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      if (checkDBError(err, DB_ERRORS.FOREIGN_KEY_CONSTRAINT)) {
        if (err.constraint === 'posts_userid_foreign')
          throw new ConflictError("User doesn't exist");
        if (err.constraint === 'posts_topicid_foreign')
          throw new ConflictError("Topic doesn't exist");
      }
      throw err;
    } finally {
      client.release();
    }
  }

  async updatePost(id, { description }) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const updates = { description, updatedAt: new Date() };
      const res = await client.query(
        'UPDATE posts SET description=$1, "updatedAt"=$2 WHERE id=$3 RETURNING *',
        [...Object.values(updates), id],
      );
      await client.query('COMMIT');
      return res.rows[0] ? new this.PostModel(res.rows[0]) : null;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async deletePost(id) {
    // CASCADE deletion
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const res = await client.query('DELETE FROM posts WHERE id=$1', [id]);
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

export default new PostRepository();
