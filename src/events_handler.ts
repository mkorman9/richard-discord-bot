import { Client, TextBasedChannels } from 'discord.js';
import { AnnouncementsChannel, MonitoredChannels } from './config';
import log from './log';
import { executeCommand } from './commands';
import { enableSchedulers, disableSchedulers } from './schedulers';
import { executeResponders } from './responders';
import { BotReadyEvent, BotClosingEvent, BotMessageEvent } from './bot.d';

export default class EventsHandler {
  private announcementsChannel: (TextBasedChannels | undefined) = undefined;

  async onReady(event: BotReadyEvent) {
    log.info('bot ready!');

    if (AnnouncementsChannel) {
      try {
        const announcementsChannel = await this.verifyAnnouncementsChannel(event.client);
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

  async onClosing(event: BotClosingEvent) {
    await disableSchedulers();
  }

  async onGuildMessage(event: BotMessageEvent) {
    if (!MonitoredChannels.has(event.message.channel.id)) {
      return;
    }

    if (event.message.content.startsWith('!')) {
      executeCommand(event.message.content.slice(1), event);
    } else {
      executeResponders(event);
    }
  }

  async onDirectMessage(event: BotMessageEvent) {
    // TODO
  }

  private async verifyAnnouncementsChannel(client: Client): Promise<TextBasedChannels> {
    return new Promise(async (resolve, reject) => {
      try {
        const channel = await client.channels.fetch(AnnouncementsChannel);
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
