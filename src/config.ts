import dotenv from 'dotenv';

dotenv.config();

export const TOKEN = process.env.TOKEN;

export const TIMEZONE = process.env.TIMEZONE || 'UTC';
export const LANGUAGE = process.env.LANGUAGE || 'pl';
