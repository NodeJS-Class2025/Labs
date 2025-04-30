class Post {
	constructor({ id, topicId, userId, description, createdAt, updatedAt }) {
		this.id = id;
		this.topicId = topicId;
		this.userId = userId;
		this.description = description;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}

export default Post;
