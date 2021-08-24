import type { CommandExecutionProps, CommandManifest } from './module';

const callback = (props: CommandExecutionProps) => {
  let msg = 'Commands Available:\n\n';
  props.commandsList.forEach((manifest) => {
    msg += `${manifest.description}\n`;
  });

  props.channel.send(msg);
};

const help: CommandManifest = {
  execute: callback,
  description: '!help - displays this text'
};

export default help;
