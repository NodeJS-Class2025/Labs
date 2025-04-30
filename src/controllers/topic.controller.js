import topicService from '../services/topic.service.js';
import { CreateTopicDto } from '../dto/topic/createTopic.dto.js';
import { UpdateTopicDto } from '../dto/topic/updateTopic.dto.js';

export const getTopics = (req, res) => {
	return res.status(200).json(topicService.getAllTopics());
};

export const getTopic = (req, res) => {
	const topic = topicService.getTopic(parseInt(req.params.topicId));
	if (!topic) {
		return res.status(404).json({ message: 'Topic not found' });
	}
	return res.status(200).json(topic);
};

export const postTopic = (req, res) => {
	const dto = new CreateTopicDto(req.body);
	const topic = topicService.createTopic(req.user.userId, dto);
	return res.status(201).json(topic);
};

export const patchTopic = (req, res, next) => {
	const dto = new UpdateTopicDto(req.body);
	try {
		const topic = topicService.updateTopic(
			req.user,
			parseInt(req.params.topicId),
			dto
		);
		if (!topic) {
			return res.status(404).json({ message: 'Topic not found' });
		}
		return res.status(200).json(topic);
	} catch (err) {
		if (err.message === 'Forbidden') {
			return res.status(403).json({ message: 'Forbidden' });
		}
		next(err);
	}
};

export const deleteTopic = (req, res, next) => {
	try {
		const result = topicService.deleteTopic(
			req.user,
			parseInt(req.params.topicId)
		);
		if (result === null) {
			return res.status(404).json({ message: 'Topic not found' });
		}
		return res.sendStatus(204);
	} catch (err) {
		if (err.message === 'Forbidden') {
			return res.status(403).json({ message: 'Forbidden' });
		}
		next(err);
	}
};
