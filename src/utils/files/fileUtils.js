import fs from 'node:fs';

export async function fileExists(path) {
  try {
    await fs.promises.access(path);
    return true;
  } catch {
    return false;
  }
}
