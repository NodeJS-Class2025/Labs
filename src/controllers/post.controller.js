import PostService from '../services/post.service.js';
import CreatePostDto from '../dto/post/createPost.dto.js';
import UpdatePostDto from '../dto/post/updatePost.dto.js';

export const getAllPosts = async (req, res) => {
	try {
		const posts = await PostService.getAllPosts();
		return res.json(posts);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const getPostById = async (req, res) => {
	try {
		const { id } = req.params;
		const post = await PostService.getPostById(id);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}
		return res.json(post);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const createPost = async (req, res) => {
	try {
		const dto = new CreatePostDto(req.body);
		const newPost = await PostService.createPost(dto);
		return res.status(201).json(newPost);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const updatePost = async (req, res) => {
	try {
		const { id } = req.params;
		const dto = new UpdatePostDto(req.body);
		const updated = await PostService.updatePost(id, dto);
		if (!updated) {
			return res.status(404).json({ message: 'Post not found' });
		}
		return res.json(updated);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const deletePost = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await PostService.deletePost(id);
		if (!deleted) {
			return res.status(404).json({ message: 'Post not found' });
		}
		return res.json({ message: 'Post deleted' });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
