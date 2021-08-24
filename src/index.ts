import dotenv from 'dotenv';

import bot from './bot';
import './events';

console.log('bot starting...');

dotenv.config();
const TOKEN = process.env.TOKEN;

if (!TOKEN) {
  console.log('missing TOKEN! Did you forgot to create .env?');
  process.exit(1);
}

bot.login(TOKEN)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

process.on('SIGINT', () => {
  process.exit(0);
});