import { MonitoredChannels } from './config';
import log from './log';
import bot from './bot';
import { executeCommand } from './commands';

bot.on('ready', () => {
  log.info('bot ready!');
});

bot.on('messageCreate', msg => {
  if (!MonitoredChannels.has(msg.channel.id)) {
    return;
  }

  if (msg.content.startsWith('!')) {
    executeCommand(msg.content.substr(1), msg);
  }
});
