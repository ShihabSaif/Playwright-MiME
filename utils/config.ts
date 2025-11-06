import dotenv from 'dotenv';
dotenv.config();

export const config = {
  baseUrl: process.env.MIME_BASE_URL || '',
  username: process.env.MIME_USERNAME || '',
  password: process.env.MIME_PASSWORD || '',
};