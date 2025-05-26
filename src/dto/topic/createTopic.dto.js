export class CreateTopicDto {
	constructor({ title }) {
		this.title = title?.trim();
	}
}
