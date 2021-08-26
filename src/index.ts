import { TOKEN, TIMEZONE, LANGUAGE } from './config';
import log from './log';
import './templates';
import bot from './bot';
import './events';

if (!TOKEN) {
  log.error('missing TOKEN! Did you forgot to create .env?');
  process.exit(1);
}

log.info(`bot starting (timezone=${TIMEZONE}, language=${LANGUAGE})...`);

bot.login(TOKEN)
  .catch(err => {
    log.error(`error while logging in: ${err}`);
    process.exit(1);
  });

process.on('SIGINT', () => {
  process.exit(0);
});
