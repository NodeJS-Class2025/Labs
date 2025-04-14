class Topic {
	constructor({ id, title, description, createdAt }) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.createdAt = createdAt || new Date().toISOString();
	}
}

export default Topic;
