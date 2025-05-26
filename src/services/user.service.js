import userRepository from '../repositories/user.repository.js';
import { getHashedPassword } from '../utils/getHashedPassword.js';

class UserService {
	constructor() {
		this.userRepo = null;
	}

	verifyUser(user, password) {
		if (!user) {
			return false;
		}
		return user.password === getHashedPassword(password);
	}

	getUserByEmail(email) {
		return userRepository.getUserByEmail(email);
	}

	getUser(id) {
		return userRepository.getUserById(id);
	}

	postUser(user) {
		user.password = getHashedPassword(user.password);
		return userRepository.createUser(user);
	}

	patchUser(id, updates) {
		const resUpdates = Object.fromEntries(
			Object.entries(updates).filter(([_, value]) => value !== undefined)
		);
		if (updates?.password) {
			resUpdates.password = getHashedPassword(updates.password);
		}
		return userRepository.updateUser(id, resUpdates);
	}

	deleteUser(id) {
		return userRepository.deleteUser(id);
	}
}

export default new UserService();
