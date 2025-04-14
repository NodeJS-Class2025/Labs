import { v4 as uuidv4 } from 'uuid';
import TopicRepository from '../repositories/topic.repository.js';
import Topic from '../models/Topic.model.js';

class TopicService {
	async getAllTopics() {
		return await TopicRepository.getAll();
	}

	async getTopicById(id) {
		return await TopicRepository.getById(id);
	}

	async createTopic(createTopicDto) {
		const newTopic = new Topic({
			id: uuidv4(),
			title: createTopicDto.title,
			description: createTopicDto.description,
		});

		return await TopicRepository.create(newTopic);
	}

	async updateTopic(id, updateTopicDto) {
		const existing = await TopicRepository.getById(id);
		if (!existing) {
			return null;
		}
		const updated = await TopicRepository.update(id, {
			title: updateTopicDto.title ?? existing.title,
			description: updateTopicDto.description ?? existing.description,
		});
		return updated;
	}

	async deleteTopic(id) {
		const result = await TopicRepository.delete(id);
		return result;
	}
}

export default new TopicService();
