import User from '../models/User.model.js';
import {
	createUser,
	getUserByEmail as getUserByEmailRepo,
	getUserById,
	updateUser,
	deleteUser as deleteUserRepo,
} from '../repositories/user.repository.js';
import { getHashedPassword } from '../utils/getHashedPassword.js';

export function verifyUser(user, password) {
	if (!user) {
		return false;
	}
	return user.password === getHashedPassword(password);
}

export function getUserByEmail(email) {
	const user = getUserByEmailRepo(email);
	if (!user) {
		return null;
	}
	return new User(user);
}

export function getUser(id) {
	const user = getUserById(id);
	if (!user) {
		return null;
	}
	return new User(user);
}

export function postUser(user) {
	user.password = getHashedPassword(user.password);
	try {
		const createdUser = new User(createUser(user));
		return createdUser;
	} catch (err) {
		throw err;
	}
}

export function patchUser(id, updates) {
	const resUpdates = Object.fromEntries(
		Object.entries(updates).filter(([_, value]) => value !== undefined)
	);
	if (updates?.password) {
		resUpdates.password = getHashedPassword(updates.password);
	}
	try {
		const user = updateUser(id, resUpdates);
		if (!user) {
			return null;
		}
		return new User(user);
	} catch (err) {
		throw err;
	}
}

export function deleteUser(id) {
	return deleteUserRepo(id);
}
