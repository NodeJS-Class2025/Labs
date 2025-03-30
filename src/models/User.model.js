class User {
  constructor({
    id,
    role,
    username,
    email,
    password,
    rawPassword,
    birthDate,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.role = role;
    this.username = username;
    this.email = email;
    this.password = password;
    this.rawPassword = rawPassword;
    this.birthDate = birthDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default User;
