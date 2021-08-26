import dotenv from 'dotenv';

dotenv.config();

export const TOKEN = process.env.TOKEN;

export const DB_LOCATION = process.env.DB_LOCATION || './db.sqlite3';

export const TIMEZONE = process.env.TIMEZONE || 'UTC';
export const LANGUAGE = process.env.LANGUAGE || 'pl';
