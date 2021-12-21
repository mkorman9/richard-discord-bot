import log from './log';
import './templates';
import bot from './bot';

process.on('SIGINT', () => {
  log.info('received a SIGINT signal');

  bot.destroy();
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  log.error(`unhandled exception: ${err.name} ${err.message}`, { stack: err.stack });
});

process.on('unhandledRejection', (reason, p) => {
  log.error(`unhandled promise rejection ${p}: ${reason}`);
});

bot.init()
  .then(() => {})
  .catch(() => process.exit(1));
