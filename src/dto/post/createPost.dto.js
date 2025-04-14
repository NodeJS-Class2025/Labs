class CreatePostDto {
	constructor({ topicId, content, authorId }) {
		this.topicId = topicId;
		this.content = content;
		this.authorId = authorId;
	}
}

export default CreatePostDto;
