export class CreateTopicDto {
  constructor({ title, category }) {
    this.title = title?.trim();
    this.category = category?.trim();
  }
}
