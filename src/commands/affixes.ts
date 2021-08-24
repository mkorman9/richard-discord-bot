import type { CommandExecutionProps, CommandManifest } from './module';
import { getAffixesForCurrentWeek } from '../affixes/rotation';

const callback = (props: CommandExecutionProps) => {
  const affixesList = getAffixesForCurrentWeek()
    .map(a => `${a.name} (${a.description})`)
    .join('\n');

  props.channel.send(affixesList);
};

const affixes: CommandManifest = {
  execute: callback,
  description: '!affixes - displays current week affixes'
};

export default affixes;
