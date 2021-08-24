import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';

dotenv.config();
const TOKEN = process.env.TOKEN;

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

console.log('bot starting');

client.login(TOKEN)
    .catch(err => {
        console.error(err);
    });

client.on('ready', () => {
    console.log('bot ready!');
});

client.on('message', msg => {
    if (msg.content === 'hello richard') {
        msg.channel.send(`hello ${msg.author.username}!`);
    }
});
