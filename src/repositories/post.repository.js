import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJsonFileAsync } from '../utils/files/readJsonFile.js';
import { writeJsonFileAsync } from '../utils/files/writeJsonFile.js';
import Logger from '../utils/logger/logger.js';
import Post from '../models/Post.model.js';
import db from '../db/connection.js';

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

  _findById(id) {
    return posts.find((p) => p.id === id);
  }

  getAll() {
    return posts.map((p) => new this.PostModel(p));
  }

  getById(id) {
    const post = this._findById(id);
    return post ? new this.PostModel(post) : null;
  }

  async getByTopic(topicId) {
    const res = await db.query('SELECT * FROM posts WHERE "topicId"=$1', [topicId]);
    return res.rows.map((row) => new this.PostModel(row));
  }

  createPost(userId, { topicId, description }) {
    const now = new Date().toISOString();
    const post = {
      id: posts.length + 1,
      topicId,
      userId,
      description,
      createdAt: now,
      updatedAt: now,
    };
    posts.push(post);
    return new this.PostModel(post);
  }

  updatePost(id, { description }) {
    const post = this._findById(id);
    if (!post) return null;

    if (description !== undefined) post.description = description;
    post.updatedAt = new Date().toISOString();

    return new this.PostModel(post);
  }

  deletePost(id) {
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    posts.splice(idx, 1);
    return true;
  }
}

export default new PostRepository();
