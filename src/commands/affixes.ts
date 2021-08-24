import type { CommandExecutionProps, CommandManifest } from './module';
import { getAffixesForCurrentWeek, getAffixesForNextWeek } from '../affixes/rotation';

const callback = (props: CommandExecutionProps) => {
  const currentWeek = getAffixesForCurrentWeek()
    .map(a => a !== null ? `- ${a.name} (${a.description})` : '- UNKNOWN')
    .join('\n');
  const nextWeek = getAffixesForNextWeek()
    .map(a => a !== null ? `- ${a.name} (${a.description})` : '- UNKNOWN')
    .join('\n');

  props.channel.send(
    `Affixes for the current week:\n` +
    `${currentWeek}\n` +
    `\n` +
    `Affixes for the next week:\n` +
    `${nextWeek}`
  );
};

const affixes: CommandManifest = {
  execute: callback,
  description: '!affixes - displays current week affixes'
};

export default affixes;
