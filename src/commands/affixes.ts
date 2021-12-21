import moment from 'moment-timezone';

import type { CommandExecutionProps, CommandManifest } from './module';
import { getRotationForDate, getRotationForWeekNumber } from '../affixes/rotation';
import { sendReply } from './utils';

const callback = (props: CommandExecutionProps) => {
  const now = moment();
  const rotationThisWeek = getRotationForDate(now);
  const rotationNextWeek = getRotationForWeekNumber(rotationThisWeek.week.weekNumber + 1);
  const weekEnd = moment.duration(rotationNextWeek.week.weekStart.diff(now));

  sendReply(props.event.message, 'affixes/show.twig', {
    now,
    rotationThisWeek,
    rotationNextWeek,
    weekEnd
  });
};

const affixes: CommandManifest = {
  execute: callback
};

export default affixes;
