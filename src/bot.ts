import { DiscordToken, Language, Timezone } from './config';
import { initDatabase } from './db';
import log from './log';
import { createDiscordClient } from './discord_client';
import EventsHandler from './events_handler';
import { Client, Message } from 'discord.js';
import { Database } from 'sqlite3';

class Bot {
  private client: Client;
  private eventsHandler: EventsHandler;
  private db: Database;

  init(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!DiscordToken) {
        log.error('missing Discord API Token! Exiting');
        reject(new Error('missing Discord token'));
      }

      log.info(`bot starting (timezone=${Timezone}, language=${Language})...`);

      this.db = initDatabase();
      this.client = createDiscordClient();
      this.eventsHandler = new EventsHandler();

      try {
        const onReadyPromise = this.registerEventsHandlerActions();
        const onLoginPromise = this.client.login(DiscordToken);
        await Promise.all([onReadyPromise, onLoginPromise]);
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

    await this.eventsHandler.onClosing({
      client: this.client,
      db: this.db
    });

    this.db.close();
    this.client.destroy();
  }

  private registerEventsHandlerActions(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.client.on('ready', async () => {
        resolve();
        this.eventsHandler.onReady({
          client: this.client,
          db: this.db
        });
      });

      this.client.on('messageCreate', async (msg: Message) => {
        if (msg.author.bot) {
          return;
        }

        if (msg.channel.type === 'DM') {
          this.eventsHandler.onDirectMessage({
            client: this.client,
            db: this.db,
            message: msg
          });
          return;
        }

        if (msg.channel.type === 'GUILD_TEXT') {
          this.eventsHandler.onGuildMessage({
            client: this.client,
            db: this.db,
            message: msg
          });
          return;
        }
      });
    });
  }
}

export default new Bot();
