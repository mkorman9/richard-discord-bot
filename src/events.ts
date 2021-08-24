import bot from './bot';
import { parseCommand } from './commands';

bot.on('ready', () => {
  console.log('bot ready!');
});

bot.on('messageCreate', msg => {
  if (msg.content.startsWith('!')) {
    const cmd = parseCommand(msg.content.substr(1));
    if (cmd) {
      cmd(msg.channel);
    }
  }
});
