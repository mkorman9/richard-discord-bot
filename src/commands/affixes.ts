import moment from 'moment-timezone';

import type { CommandExecutionProps, CommandManifest } from './module';
import { getRotationForDate } from '../affixes/rotation';
import { TIMEZONE } from '../config';
import twig from '../templates';

const callback = (props: CommandExecutionProps) => {
  const now = moment().tz(TIMEZONE).add(1, 'week');
  const rotation = getRotationForDate(now);

  twig.render('affixes.twig', {
    now,
    rotation
  })
    .then(output => {
      props.trigger.channel.send(output);
    });
};

const affixes: CommandManifest = {
  execute: callback
};

export default affixes;
