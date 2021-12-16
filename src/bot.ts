import { Client, Intents, PartialTypes } from 'discord.js';

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

export default bot;
