import Logger from '../utils/logger/logger.js';
import userRepository from './user.repository.js';
import topicRepository from './topic.repository.js';
import postRepository from './post.repository.js';

const logger = new Logger();

export async function readData() {
	try {
		await Promise.all([
			userRepository.readUsers(),
			topicRepository.readTopics(),
			postRepository.readPosts(),
		]);
		logger.info('Data successfully read');
	} catch (err) {
		logger.error({ err, msg: 'while trying to read data' });
	}
}

export async function writeData() {
	try {
		await Promise.all([
			userRepository.writeUsers(),
			topicRepository.writeTopics(),
			postRepository.writePosts(),
		]);
		logger.info('Data successfully saved');
	} catch (err) {
		logger.error({ err, msg: 'while trying to save data' });
	}
}
