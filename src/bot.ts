import { Client, Intents } from 'discord.js';

const intents = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES
];

const bot = new Client({
  intents
});

export default bot;
