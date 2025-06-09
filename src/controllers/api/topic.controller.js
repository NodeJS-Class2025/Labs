import topicService from '../../services/topic.service.js';
import { CreateTopicDto } from '../../dto/topic/createTopic.dto.js';
import { UpdateTopicDto } from '../../dto/topic/updateTopic.dto.js';
import postService from '../../services/post.service.js';

// Повертає HTML зі списком тем
export const getTopics = async (req, res) => {
  const category = req.query.category?.trim();
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const topics = await topicService.getAllTopics(page, category);
  return res.status(200).json(topics);
};

// Повертає HTML сторінку однієї теми з постами
export const getTopic = async (req, res, next) => {
  const topicId = parseInt(req.params.topicId);
  try {
    const topic = await topicService.getTopic(topicId);
    return res.status(200).json(topic);
  } catch (err) {
    next(err);
  }
};

// Обробляє POST-запит і перенаправляє
export const postTopic = async (req, res, next) => {
  const dto = new CreateTopicDto(req.body);
  try {
    const topic = await topicService.createTopic(req.user?.userId, dto);
    return res.status(201).json({ topic });
  } catch (err) {
    next(err);
  }
};

export const patchTopic = async (req, res, next) => {
  const dto = new UpdateTopicDto(req.body);
  try {
    const topic = await topicService.updateTopic(req.user, parseInt(req.params.topicId), dto);
    return res.status(200).json(topic);
  } catch (err) {
    next(err);
  }
};

export const deleteTopic = async (req, res, next) => {
  try {
    await topicService.deleteTopic(req.user, parseInt(req.params.topicId));
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
