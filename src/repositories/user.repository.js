import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileAsync } from '../utils/fileLoaders/readFile.js';
import User from '../models/User.model.js';
import { writeFileAsync } from '../utils/fileLoaders/writeFile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = [];
const pathToFile = path.resolve(__dirname, '..', 'mock', 'users.mock.json');

export async function readUsers() {
  const rawData = await readFileAsync(pathToFile);

  rawData.forEach((user) => {
    users.push(new User(user));
  });
}

export async function writeUsers() {
  try {
    await writeFileAsync(pathToFile, users[0]);
  } catch (err) {
    throw err;
  }
}
