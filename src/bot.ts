import { DiscordToken, Language, Timezone } from './config';
import DB from './db';
import log from './log';
import { createDiscordClient } from './discord_client';
import EventsHandler from './events_handler';
import { Client, Message } from 'discord.js';

class Bot {
  private client: Client;
  private eventsHandler: EventsHandler;

  init(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!DiscordToken) {
        log.error('missing Discord API Token! Exiting');
        reject(new Error('missing Discord token'));
      }

      log.info(`bot starting (timezone=${Timezone}, language=${Language})...`);

      this.client = createDiscordClient();
      this.eventsHandler = new EventsHandler(this.client);
      this.registerEventsHandlerActions();

      try {
        await this.client.login(DiscordToken);
      } catch (err) {
        log.error(`error while logging in to Discord API: ${err}`);
        reject(new Error('Discord login error'));
        return;
      }

      resolve();
    });
  }

  async destroy() {
    log.info('bot closing...');

    await this.eventsHandler.onClosing();

    DB.close();
    this.client.destroy();
  }

  private registerEventsHandlerActions() {
    this.client.on('ready', async () => {
      this.eventsHandler.onReady();
    });

    this.client.on('messageCreate', async (msg: Message) => {
      if (msg.author.bot) {
        return;
      }

      if (msg.channel.type === 'DM') {
        this.eventsHandler.onDirectMessage(msg);
        return;
      }

      if (msg.channel.type === 'GUILD_TEXT') {
        this.eventsHandler.onGuildMessage(msg);
        return;
      }
    });
  }
}

export default new Bot();
