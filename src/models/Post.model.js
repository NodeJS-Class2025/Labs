class Post {
	constructor({ id, topicId, content, authorId, createdAt }) {
		this.id = id;
		this.topicId = topicId;
		this.content = content;
		this.authorId = authorId;
		this.createdAt = createdAt || new Date().toISOString();
	}
}

export default Post;
