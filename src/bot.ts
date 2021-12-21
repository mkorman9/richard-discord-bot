import { Client, Intents, Message, PartialTypes } from 'discord.js';
import EventsHandler from './events_handler';

const intents = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.DIRECT_MESSAGES
];
const partials: PartialTypes[] = [
  'CHANNEL'
];

const bot = new Client({
  intents,
  partials
});
const eventsHandler = new EventsHandler(bot);

bot.on('ready', async () => {
  eventsHandler.onReady();
});

bot.on('messageCreate', async (msg: Message) => {
  if (msg.author.bot) {
    return;
  }

  if (msg.channel.type === 'DM') {
    eventsHandler.onDirectMessage(msg);
    return;
  }

  if (msg.channel.type === 'GUILD_TEXT') {
    eventsHandler.onGuildMessage(msg);
    return;
  }
});

export default bot;
