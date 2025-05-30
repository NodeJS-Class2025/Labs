import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { faker } from '@faker-js/faker';
import { getHashedPassword } from '../utils/getHashedPassword.js';
import { writeJsonFileAsync } from '../utils/files/writeJsonFile.js';
import { fileExists } from '../utils/files/fileUtils.js';
import Logger from '../utils/logger/logger.js';
import { USER_ROLES } from '../constants/userRoles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger();

// While using files as db
let userIndex = 1;
let topicIndex = 1;
let postIndex = 1;

const usersCount = 10;
const topicsCount = 20;
const postsCount = 100;

function getUserIndex() {
	return userIndex++;
}

function getTopicIndex() {
	return topicIndex++;
}

function getPostIndex() {
	return postIndex++;
}

function createRandomUser() {
	const password = faker.internet.password();
	const dateTime = faker.date.past();
	return {
		id: getUserIndex(),
		role: faker.helpers.arrayElement(Object.values(USER_ROLES)),
		username: faker.internet.username(),
		email: faker.internet.email().toLowerCase(),
		password: getHashedPassword(password),
		rawPassword: password, // To access fake data. Will be removed in the future
		birthDate: faker.date.birthdate().toISOString().split('T')[0],
		createdAt: dateTime,
		updatedAt: dateTime,
	};
}

function createRandomTopic() {
	const dateTime = faker.date.past();
	return {
		id: getTopicIndex(),
		userId: faker.number.int({ min: 1, max: usersCount }),
		title: faker.lorem.sentence(),
		createdAt: dateTime,
		updatedAt: dateTime,
	};
}

function createRandomPost() {
	const dateTime = faker.date.past();
	return {
		id: getPostIndex(),
		topicId: faker.number.int({ min: 1, max: topicsCount }),
		userId: faker.number.int({ min: 1, max: usersCount }),
		description: faker.lorem.sentences({ min: 1, max: 4 }),
		createdAt: dateTime,
		updatedAt: dateTime,
	};
}

async function createUsersFile(filename) {
	if (!(await fileExists(filename))) {
		const users = faker.helpers.multiple(createRandomUser, {
			count: usersCount,
		});
		try {
			await writeJsonFileAsync(filename, users);
			logger.info('Users file has been successfully created');
		} catch (err) {
			logger.error({ err });
		}
	}
}

async function createTopicsFile(filename) {
	if (!(await fileExists(filename))) {
		const topics = faker.helpers.multiple(createRandomTopic, {
			count: topicsCount,
		});
		try {
			await writeJsonFileAsync(filename, topics);
			logger.info('Topics file has been successfully created');
		} catch (err) {
			logger.error({ err });
		}
	}
}

async function createPostsFile(filename) {
	if (!(await fileExists(filename))) {
		const posts = faker.helpers.multiple(createRandomPost, {
			count: postsCount,
		});
		try {
			await writeJsonFileAsync(filename, posts);
			logger.info('Posts file has been successfully created');
		} catch (err) {
			logger.error({ err });
		}
	}
}

export async function initMockData() {
	const usersFile = path.join(__dirname, 'users.mock.json');
	const topicsFile = path.join(__dirname, 'topics.mock.json');
	const postsFile = path.join(__dirname, 'posts.mock.json');
	await Promise.all([
		createUsersFile(usersFile),
		createTopicsFile(topicsFile),
		createPostsFile(postsFile),
	]);
}
