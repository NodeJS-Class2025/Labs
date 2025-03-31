import fs from 'node:fs';

export async function writeJsonFileAsync(filePath, data) {
  try {
    const json = JSON.stringify(data, null, 2);
    fs.promises.writeFile(filePath, json, 'utf-8');
  } catch (err) {
    throw err;
  }
}
