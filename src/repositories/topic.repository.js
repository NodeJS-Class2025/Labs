import { ForeignKeyConstraintError } from 'sequelize';
import sequelize from '../db/orm.js';
import { TopicORM, PostORM } from '../models/associations.js';
import Topic from '../models/Topic.model.js';
import { ConflictError } from '../utils/httpErrors.js';
import PAGGINATION from '../constants/paggination.js';

class TopicRepository {
  constructor() {
    this.TopicModel = Topic;
  }

  async getAll(page, category) {
    const topics = await TopicORM.findAll({
      where: category ? { category } : {},
      limit: PAGGINATION.TOPICS,
      offset: PAGGINATION.TOPICS * (page - 1),
      order: [['createdAt', 'DESC']],
    });
    return topics;
  }

  async getById(id) {
    const topic = await TopicORM.findByPk(id);
    return topic;
  }

  async createTopic(userId, { title, category }) {
    try {
      const topic = await sequelize.transaction(async (t) => {
        return await TopicORM.create({ userId, title, category }, { transaction: t });
      });
      return topic;
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
