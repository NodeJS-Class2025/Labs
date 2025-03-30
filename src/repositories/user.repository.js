import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileAsync } from '../utils/fileLoaders/readFile.js';
import { writeFileAsync } from '../utils/fileLoaders/writeFile.js';
import { USER_ROLES } from '../constants/userRoles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = [];
const pathToFile = path.resolve(__dirname, '..', 'mock', 'users.mock.json');

export async function readUsers() {
  const rawData = await readFileAsync(pathToFile);

  rawData.forEach((user) => {
    // users.push(new User(user));
    users.push(user);
  });
}

export async function writeUsers() {
  try {
    await writeFileAsync(pathToFile, users[0]);
  } catch (err) {
    throw err;
  }
}

function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

function findUserByUsername(username) {
  return users.find((user) => user.username === username);
}

export function createUser(user) {
  if (findUserByUsername(user.username)) {
    throw new Error('User with that username already exists');
  }
  if (findUserByEmail(user.email)) {
    throw new Error('User with that email already exists');
  }

  const now = new Date().toISOString();
  const createdUser = {
    id: users.length + 1,
    role: USER_ROLES.USER,
    createdAt: now,
    updatedAt: now,
    ...user,
  };
  users.push(createdUser);
  return createdUser;
}

export function getUserByEmail(email) {
  return findUserByEmail(email);
}
