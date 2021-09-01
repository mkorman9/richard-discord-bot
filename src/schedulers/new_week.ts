import moment from 'moment-timezone';

import log from '../log';
import { getRotationForDate, getRotationForWeekNumber } from '../affixes/rotation';
import twig from '../templates';
import type { SchedulerExecutionProps, SchedulerManifest } from './module';

const callback = (props: SchedulerExecutionProps) => {
  log.info('running New Week scheduler');

  const now = moment();
  const rotationThisWeek = getRotationForDate(now);
  const rotationNextWeek = getRotationForWeekNumber(rotationThisWeek.week.weekNumber + 1);
  const weekEnd = moment.duration(rotationNextWeek.week.weekStart.diff(now));

  twig.render('new_week.twig', {
    now,
    rotationThisWeek,
    rotationNextWeek,
    weekEnd
  })
    .then(output => {
      props.announcementsChannel.send(output);
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
