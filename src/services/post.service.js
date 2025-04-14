import { v4 as uuidv4 } from 'uuid';
import PostRepository from '../repositories/post.repository.js';
import Post from '../models/Post.model.js';

class PostService {
	async getAllPosts() {
		return await PostRepository.getAll();
	}

	async getPostById(id) {
		return await PostRepository.getById(id);
	}

	async createPost(createPostDto) {
		const newPost = new Post({
			id: uuidv4(),
			topicId: createPostDto.topicId,
			content: createPostDto.content,
			authorId: createPostDto.authorId,
		});
		return await PostRepository.create(newPost);
	}

	async updatePost(id, updatePostDto) {
		const existing = await PostRepository.getById(id);
		if (!existing) {
			return null;
		}
		const updated = await PostRepository.update(id, {
			content: updatePostDto.content ?? existing.content,
		});
		return updated;
	}

	async deletePost(id) {
		return await PostRepository.delete(id);
	}
}

export default new PostService();
