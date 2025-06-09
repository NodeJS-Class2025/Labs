import db from '../db/connection.js';
import Post from '../models/Post.model.js';
import { ConflictError } from '../utils/httpErrors.js';
import DB_ERRORS, { checkDBError } from '../constants/dbErrors.js';
import { PostORM } from '../models/Post.orm.js';
import PAGGINATION from '../constants/paggination.js';

class PostRepository {
  constructor() {
    this.PostModel = Post;
  }

  async getAll(page) {
    const posts = await PostORM.findAll({
      limit: PAGGINATION.POSTS,
      offset: (page - 1) * PAGGINATION.POSTS,
    });
    return posts;
  }

  async getById(id) {
    const res = await db.query('SELECT * FROM posts WHERE id=$1', [id]);
    return res.rows[0] ? new this.PostModel(res.rows[0]) : null;
  }

  async getByTopic(topicId, page) {
    const posts = await PostORM.findAll({
      where: { topicId },
      limit: PAGGINATION.POSTS,
      offset: (page - 1) * PAGGINATION.POSTS,
    });
    return posts;
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
