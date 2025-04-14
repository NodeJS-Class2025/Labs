import fs from 'fs/promises';
import path from 'path';
import Post from '../models/Post.model.js';

const postsFilePath = path.join(
	path.dirname(new URL(import.meta.url).pathname),
	'../mock/posts.json'
);

class PostRepository {
	async getAll() {
		const data = await this._readFile();
		return data.map((item) => new Post(item));
	}

	async getById(id) {
		const data = await this._readFile();
		const found = data.find((post) => post.id === id);
		return found ? new Post(found) : null;
	}

	async create(postInstance) {
		const data = await this._readFile();
		data.push(postInstance);
		await this._writeFile(data);
		return postInstance;
	}

	async update(id, updatedFields) {
		const data = await this._readFile();
		const index = data.findIndex((p) => p.id === id);
		if (index === -1) return null;

		data[index] = { ...data[index], ...updatedFields };
		await this._writeFile(data);
		return data[index];
	}

	async delete(id) {
		const data = await this._readFile();
		const newData = data.filter((p) => p.id !== id);
		if (newData.length === data.length) {
			return false;
		}
		await this._writeFile(newData);
		return true;
	}

	async _readFile() {
		try {
			const fileContent = await fs.readFile(postsFilePath, 'utf-8');
			return JSON.parse(fileContent);
		} catch (error) {
			return [];
		}
	}

	async _writeFile(data) {
		await fs.writeFile(postsFilePath, JSON.stringify(data, null, 2));
	}
}

export default new PostRepository();
