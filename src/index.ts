import { TOKEN, TIMEZONE, LANGUAGE } from './config';
import log from './log';
import './templates';
import DB from './db';
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
  log.info('bot is shutting down due to a signal');

  DB.close();
  process.exit(0);
});
