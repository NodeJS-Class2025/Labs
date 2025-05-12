import topicService from '../services/topic.service.js';
import { CreateTopicDto } from '../dto/topic/createTopic.dto.js';
import { UpdateTopicDto } from '../dto/topic/updateTopic.dto.js';
import postService from '../services/post.service.js';

// Повертає HTML зі списком тем
export const getTopics = (req, res) => {
	const topics = topicService.getAllTopics();
	res.render('topics', { topics });
};

// Повертає HTML сторінку однієї теми з постами
export const getTopic = (req, res) => {
	const topicId = parseInt(req.params.topicId);
	const topic = topicService.getTopic(topicId);
	if (!topic) return res.status(404).render('404', { message: 'Тема не знайдена' });

	const posts = postService.getPostsByTopic(topicId);
	res.render('posts', { topicId, topicTitle: topic.title, posts });
};

// Повертає HTML форму створення нової теми
export const renderNewTopic = (req, res) => {
	res.render('new-topic');
};

export async function getTopicsForTemplate() {
  const topics = await Topic.find().populate('author'); // важливо populate
  return topics;
}

// Обробляє POST-запит і перенаправляє
export const postTopic = (req, res) => {
	const dto = new CreateTopicDto(req.body);
	const topic = topicService.createTopic(req.user?.userId || 1, dto); // тимчасово userId = 1
	res.redirect('/topics');
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
