import type { Channel, TextBasedChannels } from 'discord.js';

import { MonitoredChannels, AnnouncementsChannel } from './config';
import log from './log';
import bot from './bot';
import { executeCommand } from './commands';
import { enableSchedulers } from './schedulers';
import { executeResponders } from './responders';

bot.on('ready', () => {
  log.info('bot ready!');

  if (!AnnouncementsChannel) {
    log.info('announcements channel not set, schedulers won\'t be enabled');
  } else {
    bot.channels.fetch(AnnouncementsChannel)
      .then((channel: Channel) => {
        if (!channel.isText) {
          log.info(`announcements channel ${AnnouncementsChannel} is not a text channel, schedulers won't be enabled`);
          return;
        }

        const textChannel = channel as TextBasedChannels;

        log.info(`announcements will be made on #${textChannel['name']} channel`);
        enableSchedulers(textChannel);
      })
      .catch(err => {
        log.error(`failed to fetch announcements channel through API, schedulers won't be enabled: ${err}`);
      });
  }
});

bot.on('messageCreate', msg => {
  if (msg.author.bot) {
    return;
  }

  if (!MonitoredChannels.has(msg.channel.id)) {
    return;
  }

  if (msg.content.startsWith('!')) {
    executeCommand(msg.content.substr(1), msg);
  } else {
    executeResponders(msg);
  }
});
