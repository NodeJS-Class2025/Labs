export class ProfileOutputDto {
	constructor({
		id,
		role,
		username,
		email,
		birthDate,
		createdAt,
		updatedAt,
	}) {
		this.id = id;
		this.role = role;
		this.username = username;
		this.email = email;
		this.birthDate = birthDate;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}
