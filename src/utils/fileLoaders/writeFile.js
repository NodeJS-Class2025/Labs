import fs from 'node:fs';

export async function writeFileAsync(filePath, data) {
  try {
    const json = JSON.stringify(data, null, 2);
    fs.promises.writeFile(filePath, json);
  } catch (err) {
    throw err;
  }
}
