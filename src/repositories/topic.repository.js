import { ForeignKeyConstraintError } from 'sequelize';
import sequelize from '../db/orm.js';
import { TopicORM, PostORM } from '../models/associations.js';
import Topic from '../models/Topic.model.js';
import { ConflictError } from '../utils/httpErrors.js';

class TopicRepository {
  constructor() {
    this.TopicModel = Topic;
  }

  async getAll() {
    const topics = await TopicORM.findAll({
      include: { model: PostORM, as: 'posts' },
      order: [['createdAt', 'DESC']],
    });
    return topics.map((row) => new this.TopicModel(row.toJSON()));
  }

  async getById(id) {
    const topic = await TopicORM.findByPk(id, {
      include: { model: PostORM, as: 'posts' },
    });
    return topic ? new this.TopicModel(topic.toJSON()) : null;
  }

  async createTopic(userId, { title }) {
    try {
      const topic = await sequelize.transaction(async (t) => {
        return await TopicORM.create({ userId, title }, { transaction: t });
      });
      return new this.TopicModel(topic.toJSON());
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) throw new ConflictError("User doesn't exist");
      throw err;
    }
  }

  async updateTopic(id, { title }) {
    const topic = await sequelize.transaction(async (t) => {
      const found = await TopicORM.findByPk(id, { transaction: t });
      if (!found) return null;
      await found.update({ title }, { transaction: t });
      return found;
    });
    return topic ? new this.TopicModel(topic.toJSON()) : null;
  }

  async deleteTopic(id) {
    const rowsDeleted = await sequelize.transaction(async (t) => {
      return await TopicORM.destroy({ where: { id }, transaction: t });
    });
    return rowsDeleted;
  }
}

export default new TopicRepository();
