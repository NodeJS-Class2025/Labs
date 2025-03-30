import crypto from 'node:crypto';

export function getHashedPassword(password) {
  return crypto.createHash('md5').update(password).digest().toString('hex');
}
