import moment from 'moment-timezone';

import type { CommandExecutionProps, CommandManifest } from './module';
import { getRotationForDate, getRotationForWeekNumber } from '../affixes/rotation';
import twig from '../templates';

const callback = (props: CommandExecutionProps) => {
  const now = moment();
  const rotationThisWeek = getRotationForDate(now);
  const rotationNextWeek = getRotationForWeekNumber(rotationThisWeek.week.weekNumber + 1);
  const weekEnd = moment.duration(rotationNextWeek.week.weekStart.diff(now));

  twig.render('affixes_default.twig', {
    now,
    rotationThisWeek,
    rotationNextWeek,
    weekEnd
  })
    .then(output => {
      props.message.reply(output);
    });
};

const affixes: CommandManifest = {
  execute: callback
};

export default affixes;
