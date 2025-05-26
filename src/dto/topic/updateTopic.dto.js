export class UpdateTopicDto {
	constructor({ title }) {
		this.title = title?.trim();
	}
}
