import type { CommandExecutionProps, CommandManifest } from './module';
import { getRotationForDate } from '../affixes/rotation';
import moment from 'moment-timezone';
import { TIMEZONE } from '../config';

const callback = (props: CommandExecutionProps) => {
  const now = moment().tz(TIMEZONE);
  const rotation = getRotationForDate(now);
  const affixes = rotation.affixes
    .map(a => `- ${a.name} (${a.description})`)
    .join('\n');

  props.trigger.channel.send(
    `Affixes for the current week (start ${rotation.week.weekStart.format('YYYY-MM-DD')}):\n` +
    `${affixes}\n` +
    `\n` +
    `${now.format()}, week number = ${rotation.week.weekNumber}`
  );
};

const affixes: CommandManifest = {
  execute: callback,
  description: '!affixes - displays current week affixes'
};

export default affixes;
