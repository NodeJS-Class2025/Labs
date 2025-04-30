import topicRepository from '../repositories/topic.repository.js';

class TopicService {
	getAllTopics() {
		return topicRepository.getAll();
	}

	getTopic(id) {
		return topicRepository.getById(id);
	}

	createTopic(userId, dto) {
		return topicRepository.createTopic(userId, dto);
	}

	updateTopic(currentUser, topicId, dto) {
		const topic = topicRepository.getById(topicId);
		if (!topic) return null;
		return topicRepository.updateTopic(topicId, dto);
	}

	deleteTopic(currentUser, topicId) {
		const topic = topicRepository.getById(topicId);
		if (!topic) return null;
		return topicRepository.deleteTopic(topicId);
	}
}

export default new TopicService();
