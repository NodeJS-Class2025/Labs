import Logger from '../utils/logger/logger.js';
import { readUsers, writeUsers } from './user.repository.js';

const logger = new Logger();

export async function readData() {
	try {
		await Promise.all([readUsers()]); // topics, posts
		logger.info('Data successfully read');
	} catch (err) {
		logger.error({ err, msg: 'while trying to read data' });
	}
}

export async function writeData() {
	try {
		await Promise.all([writeUsers()]); // topics, posts
		logger.info('Data successfully saved');
	} catch (err) {
		logger.error({ err, msg: 'while trying to save data' });
	}
}
