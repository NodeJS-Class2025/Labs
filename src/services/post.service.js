import postRepository from '../repositories/post.repository.js';
import userRepository from '../repositories/user.repository.js';
import { NotFoundError, ForbiddenError } from '../utils/httpErrors.js';

class PostService {
  async getAllPosts(page) {
    return await postRepository.getAll(page);
  }

  async getPost(id) {
    const post = await postRepository.getById(id);
    if (!post) throw new NotFoundError('Post not found');
    return post;
  }

  async getPostsByTopic(topicId, page) {
    return await postRepository.getByTopic(topicId, page);
  }

  async createPost(userId, dto) {
    return await postRepository.createPost(userId, dto);
  }

  async updatePost(currentUser, postId, dto) {
    const user = await userRepository.getUserById(currentUser.userId);
    if (!user) throw new NotFoundError('User not found');

    const postBeforeUpdate = await postRepository.getById(postId);
    if (!postBeforeUpdate) throw new NotFoundError('Post not found');
    if (postBeforeUpdate.userId !== currentUser.userId)
      throw new ForbiddenError('Post is not yours');

    const post = await postRepository.updatePost(postId, dto);
    if (!post) throw new NotFoundError('Post not found');
    return post;
  }

  async deletePost(currentUser, postId) {
    const user = await userRepository.getUserById(currentUser.userId);
    if (!user) throw new NotFoundError('User not found');

    const postBeforeDel = await postRepository.getById(postId);
    if (!postBeforeDel) throw new NotFoundError('Post not found');
    if (postBeforeDel.userId !== currentUser.userId) throw new ForbiddenError('Post is not yours');

    const rowsCount = await postRepository.deletePost(postId);
    if (!rowsCount) throw new NotFoundError('Post not found');
  }
}

export default new PostService();
