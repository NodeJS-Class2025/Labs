import TopicService from '../services/topic.service.js';
import CreateTopicDto from '../dto/topic/createTopic.dto.js';
import UpdateTopicDto from '../dto/topic/updateTopic.dto.js';

export const getAllTopics = async (req, res) => {
	try {
		const topics = await TopicService.getAllTopics();
		return res.json(topics);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const getTopicById = async (req, res) => {
	try {
		const { id } = req.params;
		const topic = await TopicService.getTopicById(id);
		if (!topic) {
			return res.status(404).json({ message: 'Topic not found' });
		}
		return res.json(topic);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const createTopic = async (req, res) => {
	try {
		const dto = new CreateTopicDto(req.body);
		const createdTopic = await TopicService.createTopic(dto);
		return res.status(201).json(createdTopic);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const updateTopic = async (req, res) => {
	try {
		const { id } = req.params;
		const dto = new UpdateTopicDto(req.body);
		const updated = await TopicService.updateTopic(id, dto);

		if (!updated) {
			return res.status(404).json({ message: 'Topic not found' });
		}
		return res.json(updated);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const deleteTopic = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await TopicService.deleteTopic(id);
		if (!deleted) {
			return res.status(404).json({ message: 'Topic not found' });
		}
		return res.json({ message: 'Topic deleted' });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
