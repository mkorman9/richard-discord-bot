import dotenv from 'dotenv';

dotenv.config();

export const TOKEN = process.env.TOKEN;

export const DB_DIR_LOCATION = process.env.DB_DIR_LOCATION || './db';

export const TIMEZONE = process.env.TIMEZONE || 'UTC';
export const LANGUAGE = process.env.LANGUAGE || 'pl';
