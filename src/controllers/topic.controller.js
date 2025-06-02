import topicService from '../services/topic.service.js';
import { CreateTopicDto } from '../dto/topic/createTopic.dto.js';
import { UpdateTopicDto } from '../dto/topic/updateTopic.dto.js';
import postService from '../services/post.service.js';
import { ConflictError, HttpError, NotFoundError } from '../utils/httpErrors.js';

// Повертає HTML зі списком тем
export const getTopics = async (req, res) => {
  const topics = await topicService.getAllTopics();
  res.render('topics', { topics });
};

// Повертає HTML сторінку однієї теми з постами
export const getTopic = async (req, res, next) => {
  const topicId = parseInt(req.params.topicId);
  try {
    const topic = await topicService.getTopic(topicId);

    const posts = await postService.getPostsByTopic(topicId);
    res.render('posts', { topicId, topicTitle: topic.title, posts });
  } catch (err) {
    if (err instanceof HttpError)
      return res.status(err.statusCode).render('404', { message: err.message });
    next(err);
  }
};

// Обробляє POST-запит і перенаправляє
export const postTopic = async (req, res, next) => {
  const dto = new CreateTopicDto(req.body);
  try {
    const topic = await topicService.createTopic(req.user?.userId, dto);
    res.redirect('/topics');
  } catch (err) {
    if (err instanceof ConflictError) {
      res.clearCookie('jwt');
      return res.redirect('/auth/login');
    }
    next(err);
  }
};

export const patchTopic = async (req, res, next) => {
  const dto = new UpdateTopicDto(req.body);
  try {
    const topic = await topicService.updateTopic(req.user, parseInt(req.params.topicId), dto);
    return res.status(200).json(topic);
  } catch (err) {
    if (err instanceof HttpError) {
      if (err instanceof NotFoundError && err.message.includes('User')) {
        res.clearCookie('jwt');
        return res.redirect('/auth/login');
      }
      return res.status(err.statusCode).json({ message: err.message });
    }
    // return res.status(403).json({ message: 'Forbidden' });
    next(err);
  }
};

export const deleteTopic = async (req, res, next) => {
  try {
    const result = await topicService.deleteTopic(req.user, parseInt(req.params.topicId));
    return res.sendStatus(204);
  } catch (err) {
    if (err instanceof HttpError) {
      if (err instanceof NotFoundError && err.message.includes('User')) {
        res.clearCookie('jwt');
        return res.redirect('/auth/login');
      }
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
};

// Повертає HTML форму створення нової теми
export const postTopicView = (req, res) => {
  res.render('new-topic');
};

export const postPostForTopicView = (req, res) => {
  const topicId = parseInt(req.params.topicId);
  res.render('new-post', { topicId });
};
