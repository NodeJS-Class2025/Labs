export class ProfileInputDto {
	constructor({ username, email, password, birthDate }) {
		this.username = username;
		this.email = email?.toLowerCase();
		this.password = password;
		this.birthDate = birthDate?.split('T')[0];
	}
}
