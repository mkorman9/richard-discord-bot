import log from './log';
import bot from './bot';
import { executeCommand } from './commands';

bot.on('ready', () => {
  log.info('bot ready!');
});

bot.on('messageCreate', msg => {
  if (msg.content.startsWith('!')) {
    executeCommand(msg.content.substr(1), msg);
  }
});
