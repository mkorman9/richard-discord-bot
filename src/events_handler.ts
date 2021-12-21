import { Client, Message, TextBasedChannels } from 'discord.js';
import { AnnouncementsChannel, MonitoredChannels } from './config';
import log from './log';
import { executeCommand } from './commands';
import { enableSchedulers } from './schedulers';
import { executeResponders } from './responders';

export default class EventsHandler {
  private client: Client;
  private announcementsChannel: (TextBasedChannels | undefined) = undefined;

  constructor(client: Client) {
    this.client = client;
  }

  async onReady() {
    log.info('bot ready!');

    if (AnnouncementsChannel) {
      try {
        const announcementsChannel = await this.verifyAnnouncementsChannel();
        this.announcementsChannel = announcementsChannel;
      } catch (err) {
      }
    }

    if (this.announcementsChannel) {
      enableSchedulers(this.announcementsChannel);
    } else {
      log.info('schedulers will not be enabled because of the missing announcements channel');
    }
  }

  async onGuildMessage(msg: Message) {
    if (!MonitoredChannels.has(msg.channel.id)) {
      return;
    }

    if (msg.content.startsWith('!')) {
      executeCommand(msg.content.slice(1), msg);
    } else {
      executeResponders(msg);
    }
  }

  async onDirectMessage(msg: Message) {
    // TODO
  }

  private async verifyAnnouncementsChannel(): Promise<TextBasedChannels> {
    return new Promise(async (resolve, reject) => {
      try {
        const channel = await this.client.channels.fetch(AnnouncementsChannel);
        if (!channel.isText) {
          log.info(`announcements channel ${AnnouncementsChannel} is not a text channel`);
          reject();
          return;
        }

        const textChannel = channel as TextBasedChannels;
        log.info(`announcements will be made on #${textChannel['name']} channel`);
        resolve(textChannel);
      } catch (err) {
        log.error(`failed to fetch announcements channel through API: ${err}`);
        reject(err);
      }
    });
  }
}
