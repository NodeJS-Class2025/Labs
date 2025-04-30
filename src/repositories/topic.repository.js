import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJsonFileAsync } from '../utils/files/readJsonFile.js';
import { writeJsonFileAsync } from '../utils/files/writeJsonFile.js';
import Logger from '../utils/logger/logger.js';
import Topic from '../models/Topic.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger();

const topics = [];
const pathToFile = path.resolve(__dirname, '..', 'mock', 'topics.mock.json');

class TopicRepository {
	constructor() {
		this.TopicModel = Topic;
	}

	async readTopics() {
		try {
			const raw = await readJsonFileAsync(pathToFile);
			raw.forEach((t) => topics.push(t));
		} catch (err) {
			logger.error({ err });
		}
	}

	async writeTopics() {
		await writeJsonFileAsync(pathToFile, topics);
	}

	_findById(id) {
		return topics.find((t) => t.id === id);
	}

	getAll() {
		return topics.map((t) => new this.TopicModel(t));
	}

	getById(id) {
		const topic = this._findById(id);
		return topic ? new this.TopicModel(topic) : null;
	}

	createTopic(userId, { title }) {
		const now = new Date().toISOString();
		const topic = {
			id: topics.length + 1,
			userId,
			title,
			createdAt: now,
			updatedAt: now,
		};
		topics.push(topic);
		return new this.TopicModel(topic);
	}

	updateTopic(id, { title }) {
		const topic = this._findById(id);
		if (!topic) return null;

		if (title !== undefined) topic.title = title;
		topic.updatedAt = new Date().toISOString();

		return new this.TopicModel(topic);
	}

	deleteTopic(id) {
		const idx = topics.findIndex((t) => t.id === id);
		if (idx === -1) return false;
		topics.splice(idx, 1);
		return true;
	}
}

export default new TopicRepository();
