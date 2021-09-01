import { DiscordToken, Timezone, Language } from './config';
import log from './log';
import './templates';
import DB from './db';
import bot from './bot';
import './events';

if (!DiscordToken) {
  log.error('missing Discord API Token! Exiting');
  process.exit(1);
}

log.info(`bot starting (timezone=${Timezone}, language=${Language})...`);

bot.login(DiscordToken)
  .catch(err => {
    log.error(`error while logging in: ${err}`);
    process.exit(1);
  });

process.on('SIGINT', () => {
  log.info('bot is shutting down due to a signal');

  DB.close();
  process.exit(0);
});
