import fs from 'node:fs';
import Logger from '../logger/logger.js';

const logger = new Logger();

export function readFileSynchronously(filePath) {
  try {
    const json = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(json);
    return data;
  } catch (err) {
    logger.error({ err });
  }
}

export function readFileCallback(filePath, callback) {
  fs.readFile(filePath, 'utf-8', (err, json) => {
    if (err) {
      return callback(err);
    }
    try {
      const data = JSON.parse(json);
      callback(null, data);
    } catch (parseErr) {
      callback(parseErr);
    }
  });
}

export function readFilePromise(filePath) {
  return fs.promises
    .readFile(filePath, 'utf-8')
    .then((json) => JSON.parse(json))
    .catch((err) => logger.error({ err }));
}

export async function readFileAsync(filePath) {
  try {
    const json = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(json);
  } catch (err) {
    logger.error({ err });
  }
}
