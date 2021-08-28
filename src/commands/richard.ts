import twig from '../templates';
import type { CommandExecutionProps, CommandManifest } from './module';

const callback = (props: CommandExecutionProps) => {
  twig.render('richard.twig', {})
    .then(output => {
      props.message.reply(output);
    });
};

const richard: CommandManifest = {
  execute: callback
};

export default richard;
