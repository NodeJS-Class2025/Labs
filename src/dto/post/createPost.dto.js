export class CreatePostDto {
	constructor({ description }, topicId) {
		this.topicId = Number(topicId);
		this.description = description;
	}
}
