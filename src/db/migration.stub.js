import { fileURLToPath } from 'node:url';
import mgLogger from '../mgLogger.js';

const __filename = fileURLToPath(import.meta.url);
const file = __filename.split(/[/\\]/).pop();

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  try {
    // migration
    mgLogger?.info(`Migration "${file}" up successfuly completed`);
  } catch (err) {
    mgLogger?.error({ msg: `Migration "${file}" up failed`, err });
    throw err;
  }
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  try {
    // migration
    mgLogger?.info(`Migration "${file}" down successfuly completed`);
  } catch (err) {
    mgLogger?.error({ msg: `Migration "${file}" down failed`, err });
    throw err;
  }
}
