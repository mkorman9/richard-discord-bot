import bot from './bot';

bot.on('ready', () => {
  console.log('bot ready!');
});

bot.on('messageCreate', msg => {
  if (msg.content === 'hello richard') {
    msg.channel.send(`hello ${msg.author.username}!`);
  }
});
