import { Channel, Message, MessageFlags, TextBasedChannels } from 'discord.js';

import { MonitoredChannels, AnnouncementsChannel } from './config';
import log from './log';
import bot from './bot';
import { executeCommand } from './commands';
import { enableSchedulers } from './schedulers';
import { executeResponders } from './responders';
import { rejects } from 'assert';

bot.on('ready', async () => {
  log.info('bot ready!');

  if (AnnouncementsChannel) {
    try {
      const announcementsChannel = await verifyAnnouncementsChannel();
      enableSchedulers(announcementsChannel);
    } catch (err) {
    }
  } else {
    log.info('announcements channel not set, schedulers won\'t be enabled');
  }
});

bot.on('messageCreate', msg => {
  if (msg.author.bot) {
    return;
  }

  if (msg.channel.type === 'DM') {
    handleDirectMessage(msg);
    return;
  }

  if (msg.channel.type === 'GUILD_TEXT') {
    handleGuildMessage(msg);
    return;
  }
});

const verifyAnnouncementsChannel = async (): Promise<TextBasedChannels> => {
  return new Promise(async (resolve, reject) => {
    try {
      const channel = await bot.channels.fetch(AnnouncementsChannel);
      if (!channel.isText) {
        log.info(`announcements channel ${AnnouncementsChannel} is not a text channel, schedulers won't be enabled`);
        reject();
        return;
      }

      const textChannel = channel as TextBasedChannels;
      log.info(`announcements will be made on #${textChannel['name']} channel`);
      resolve(textChannel);
    } catch (err) {
      log.error(`failed to fetch announcements channel through API, schedulers won't be enabled: ${err}`);
      reject(err);
    }
  });
};

const handleDirectMessage = (msg: Message) => {
  // TODO
};

const handleGuildMessage = (msg: Message) => {
  if (!MonitoredChannels.has(msg.channel.id)) {
    return;
  }

  if (msg.content.startsWith('!')) {
    executeCommand(msg.content.substr(1), msg);
  } else {
    executeResponders(msg);
  }
};
