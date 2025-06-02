import postRepository from '../repositories/post.repository.js';
import topicRepository from '../repositories/topic.repository.js';
import { USER_ROLES } from '../constants/userRoles.js';

class PostService {
  getAllPosts() {
    return postRepository.getAll();
  }

  getPost(id) {
    return postRepository.getById(id);
  }

  async getPostsByTopic(topicId) {
    return await postRepository.getByTopic(topicId);
  }

  createPost(userId, dto) {
    const topic = topicRepository.getById(dto.topicId);
    if (!topic) throw new Error('Topic not found');
    return postRepository.createPost(userId, dto);
  }

  updatePost(currentUser, postId, dto) {
    const post = postRepository.getById(postId);
    if (!post) return null;
    if (currentUser.role !== USER_ROLES.ADMIN && post.userId !== currentUser.userId) {
      throw new Error('Forbidden');
    }
    return postRepository.updatePost(postId, dto);
  }

  deletePost(currentUser, postId) {
    const post = postRepository.getById(postId);
    if (!post) return null;
    if (currentUser.role !== USER_ROLES.ADMIN && post.userId !== currentUser.userId) {
      throw new Error('Forbidden');
    }
    return postRepository.deletePost(postId);
  }
}

export default new PostService();
