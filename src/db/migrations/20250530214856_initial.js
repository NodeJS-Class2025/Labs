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
    await knex.raw(`CREATE TYPE user_role AS ENUM ('admin', 'user')`);

    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.specificType('role', 'user_role').notNullable().defaultTo('user');
      table.string('username').notNullable().unique();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.date('birthDate').nullable();
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('topics', (table) => {
      table.increments('id').primary();
      table.integer('userId').notNullable();
      table.string('title').notNullable();
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('posts', (table) => {
      table.increments('id').primary();
      table.integer('topicId').notNullable();
      table.integer('userId').notNullable();
      table.text('description').notNullable();
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.alterTable('topics', (table) => {
      table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
    });

    await knex.schema.alterTable('posts', (table) => {
      table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
      table.foreign('topicId').references('id').inTable('topics').onDelete('CASCADE');
    });

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
    await knex.schema.dropTableIfExists('posts');
    await knex.schema.dropTableIfExists('topics');
    await knex.schema.dropTableIfExists('users');
    await knex.raw('DROP TYPE IF EXISTS user_role');

    mgLogger?.info(`Migration "${file}" down successfuly completed`);
  } catch (err) {
    mgLogger?.error({ msg: `Migration "${file}" down failed`, err });
    throw err;
  }
}
