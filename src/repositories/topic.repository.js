import fs from 'fs/promises';
import path from 'path';
import Topic from '../models/Topic.model.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const topicsFilePath = path.resolve(
//   __dirname,
//   '..',
//   'mock',
//   'topics.mock.json'
// );

const topicsFilePath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  '../mock/topics.json'
);

class TopicRepository {
  async getAll() {
    const data = await this._readFile();
    return data.map((item) => new Topic(item));
  }

  async getById(id) {
    const data = await this._readFile();
    const found = data.find((topic) => topic.id === id);
    return found ? new Topic(found) : null;
  }

  async create(topicInstance) {
    const data = await this._readFile();
    data.push(topicInstance);
    await this._writeFile(data);
    return topicInstance;
  }

  async update(id, updatedFields) {
    const data = await this._readFile();
    const index = data.findIndex((t) => t.id === id);
    if (index === -1) return null;

    data[index] = { ...data[index], ...updatedFields };
    await this._writeFile(data);
    return data[index];
  }

  async delete(id) {
    const data = await this._readFile();
    const newData = data.filter((t) => t.id !== id);
    if (newData.length === data.length) {
      return false;
    }
    await this._writeFile(newData);
    return true;
  }

  async _readFile() {
    try {
      const fileContent = await fs.readFile(topicsFilePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(topicsFilePath, JSON.stringify(data, null, 2));
  }
}

export default new TopicRepository();
