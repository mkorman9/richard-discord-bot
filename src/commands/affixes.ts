import type { CommandExecutionProps, CommandManifest } from './module';
import { getRotationForDate } from '../affixes/rotation';
import moment from 'moment';

const callback = (props: CommandExecutionProps) => {
  const rotation = getRotationForDate(moment());
  const affixes = rotation.affixes
    .map(a => `- ${a.name} (${a.description})`)
    .join('\n');

  props.channel.send(
    `Affixes for the current week (start ${rotation.week.weekStart.format('YYYY-MM-DD')}):\n` +
    `${affixes}\n`
  );
};

const affixes: CommandManifest = {
  execute: callback,
  description: '!affixes - displays current week affixes'
};

export default affixes;
