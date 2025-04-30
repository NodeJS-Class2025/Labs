import topicRepository from '../repositories/topic.repository.js';
import { USER_ROLES } from '../constants/userRoles.js';

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
		if (
			currentUser.role !== USER_ROLES.ADMIN &&
			topic.userId !== currentUser.userId
		) {
			throw new Error('Forbidden');
		}
		return topicRepository.updateTopic(topicId, dto);
	}

	deleteTopic(currentUser, topicId) {
		const topic = topicRepository.getById(topicId);
		if (!topic) return null;
		if (
			currentUser.role !== USER_ROLES.ADMIN &&
			topic.userId !== currentUser.userId
		) {
			throw new Error('Forbidden');
		}
		return topicRepository.deleteTopic(topicId);
	}
}

export default new TopicService();
