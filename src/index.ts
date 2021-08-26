import bot from './bot';
import './events';
import { TOKEN, TIMEZONE } from './config';

if (!TOKEN) {
  console.log('missing TOKEN! Did you forgot to create .env?');
  process.exit(1);
}

console.log(`bot starting (timezone=${TIMEZONE})...`);

bot.login(TOKEN)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

process.on('SIGINT', () => {
  process.exit(0);
});
