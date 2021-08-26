import twig from '../templates';
import type { CommandExecutionProps, CommandManifest } from './module';

const callback = (props: CommandExecutionProps) => {
  twig.render('help.twig', {})
    .then(output => {
      props.trigger.channel.send(output);
    });
};

const help: CommandManifest = {
  execute: callback
};

export default help;
