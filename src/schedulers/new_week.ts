import moment from 'moment-timezone';

import log from '../log';
import { getRotationForDate, getRotationForWeekNumber } from '../affixes/rotation';
import twig from '../templates';
import { AnnouncementsChannel } from '../config';
import type { SchedulerManifest } from './module';
import type { BotContext } from '../bot.d';
import { TextBasedChannels } from 'discord.js';

const callback = (context: BotContext) => {
  const channel = context.client.channels.cache.get(AnnouncementsChannel) as TextBasedChannels;
  if (!channel) {
    return;
  }

  log.info('running New Week scheduler');

  const now = moment();
  const rotationThisWeek = getRotationForDate(now);
  const rotationNextWeek = getRotationForWeekNumber(rotationThisWeek.week.weekNumber + 1);
  const weekEnd = moment.duration(rotationNextWeek.week.weekStart.diff(now));

  twig.render('new_week/message.twig', {
    now,
    rotationThisWeek,
    rotationNextWeek,
    weekEnd
  })
    .then(output => {
      channel.send(output);
    });
};

const newWeek: SchedulerManifest = {
  execute: callback,
  rule: {
    dayOfWeek: 3,
    hour: 9,
    minute: 0
  }
};

export default newWeek;
