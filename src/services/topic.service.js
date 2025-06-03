import topicRepository from '../repositories/topic.repository.js';
import userRepository from '../repositories/user.repository.js';
import { ForbiddenError, NotFoundError } from '../utils/httpErrors.js';

class TopicService {
  async getAllTopics() {
    return await topicRepository.getAll();
  }

  async getTopic(id) {
    const topic = await topicRepository.getById(id);
    if (!topic) throw new NotFoundError('Topic not found');
    return topic;
  }

  async createTopic(userId, dto) {
    return await topicRepository.createTopic(userId, dto);
  }

  async updateTopic(currentUser, topicId, dto) {
    const user = await userRepository.getUserById(currentUser.userId);
    if (!user) throw new NotFoundError('User not found');

    const topicBeforeUpdate = await topicRepository.getById(topicId);
    if (!topicBeforeUpdate) throw new NotFoundError('Topic not found');
    if (topicBeforeUpdate.userId !== currentUser.userId)
      throw new ForbiddenError('Topic is not yours');

    const topic = await topicRepository.updateTopic(topicId, dto);
    if (!topic) throw new NotFoundError('Topic not found');
    return topic;
  }

  async deleteTopic(currentUser, topicId) {
    const user = await userRepository.getUserById(currentUser.userId);
    if (!user) throw new NotFoundError('User not found');

    const topicBeforeDel = await topicRepository.getById(topicId);
    if (!topicBeforeDel) throw new NotFoundError('Topic not found');
    if (topicBeforeDel.userId !== currentUser.userId)
      throw new ForbiddenError('Topic is not yours');

    const rowsCount = await topicRepository.deleteTopic(topicId);
    if (!rowsCount) throw new NotFoundError('Topic not found');
  }
}

export default new TopicService();
