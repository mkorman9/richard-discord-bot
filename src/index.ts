import { Token, Timezone, Language } from './config';
import log from './log';
import './templates';
import DB from './db';
import bot from './bot';
import './events';

if (!Token) {
  log.error('missing TOKEN! Did you forgot to create config.yml?');
  process.exit(1);
}

log.info(`bot starting (timezone=${Timezone}, language=${Language})...`);

bot.login(Token)
  .catch(err => {
    log.error(`error while logging in: ${err}`);
    process.exit(1);
  });

process.on('SIGINT', () => {
  log.info('bot is shutting down due to a signal');

  DB.close();
  process.exit(0);
});
