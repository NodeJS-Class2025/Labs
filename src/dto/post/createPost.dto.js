export class CreatePostDto {
	constructor({ topicId, description }) {
		this.topicId = Number(topicId);
		this.description = description;
	}
}
