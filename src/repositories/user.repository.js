import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJsonFileAsync } from '../utils/files/readJsonFile.js';
import { writeJsonFileAsync } from '../utils/files/writeJsonFile.js';
import { USER_ROLES } from '../constants/userRoles.js';
import Logger from '../utils/logger/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger();

const users = [];
const pathToFile = path.resolve(__dirname, '..', 'mock', 'users.mock.json');

export async function readUsers() {
	try {
		const rawData = await readJsonFileAsync(pathToFile);

		rawData.forEach((user) => {
			// users.push(new User(user));
			users.push(user);
		});
	} catch (err) {
		logger.error({ err });
	}
}

export async function writeUsers() {
	try {
		await writeJsonFileAsync(pathToFile, users);
	} catch (err) {
		throw err;
	}
}

function findUserByEmail(email) {
	return users.find((user) => user.email === email);
}

function findUserByUsername(username) {
	return users.find((user) => user.username === username);
}

export function getUserByEmail(email) {
	return findUserByEmail(email);
}

export function getUserById(id) {
	return users.find((user) => user.id === id);
}

export function createUser(user) {
	if (findUserByUsername(user.username)) {
		throw new Error('User with that username already exists');
	}
	if (findUserByEmail(user.email)) {
		throw new Error('User with that email already exists');
	}

	const now = new Date().toISOString();
	const createdUser = {
		id: users.length + 1,
		role: USER_ROLES.USER,
		...user,
		createdAt: now,
		updatedAt: now,
	};
	users.push(createdUser);
	return createdUser;
}

export function updateUser(id, updates) {
	if (updates?.username && findUserByUsername(updates.username)) {
		throw new Error('User with that username already exists');
	}
	if (updates?.email && findUserByEmail(updates.email)) {
		throw new Error('User with that email already exists');
	}

	const user = getUserById(id);
	if (!user) {
		return null;
	}
	updates.updatedAt = new Date().toISOString();
	return Object.assign(user, updates);
}

export function deleteUser(id) {
	const userIndex = users.findIndex((user) => user.id === id);
	if (userIndex === -1) {
		return false;
	}
	users.splice(userIndex, 1);
	return true;
}
