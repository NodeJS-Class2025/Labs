export class LoginInputDto {
  constructor({ email, password }) {
    this.email = email.toLowerCase();
    this.password = password;
  }
}
