import type { TextBasedChannels } from 'discord.js';

import help from './commands/help';
import type { CommandManifest } from './commands/module';

export type CommandCallback = (channel: TextBasedChannels) => void;
export type Command =
  CommandCallback
  | null;

const commandsList = new Map<string, CommandManifest>(Object.entries({
  'help': help
}));

export const parseCommand = (str: string): Command => {
  const parts = str.split(' ').filter(p => p.length > 0);
  if (!parts) {
    return null;
  }

  const command = parts[0].toLocaleLowerCase();
  const args = parts.splice(1);

  if (!commandsList.has(command)) {
    return null;
  }

  return (channel: TextBasedChannels) => {
    commandsList.get(command).execute({
      command,
      args,
      channel,
      commandsList
    });
  };
};
