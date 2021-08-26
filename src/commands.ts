import type { Message } from 'discord.js';

import help from './commands/help';
import affixes from './commands/affixes';
import type { CommandManifest } from './commands/module';

export type CommandCallback = (trigger: Message) => void;
export type Command =
  CommandCallback
  | null;

const commandsList = new Map<string, CommandManifest>(Object.entries({
  'help': help,
  'affixes': affixes
}));

const parseCommand = (str: string): Command => {
  const parts = str.split(' ').filter(p => p.length > 0);
  if (!parts) {
    return null;
  }

  const command = parts[0].toLocaleLowerCase();
  const args = parts.splice(1);

  if (!commandsList.has(command)) {
    return null;
  }

  return (trigger: Message) => {
    commandsList.get(command).execute({
      command,
      args,
      trigger
    });
  };
};

export const executeCommand = (str: string, trigger: Message): boolean => {
  const cmd = parseCommand(str);
  if (cmd) {
    cmd(trigger);
    return true;
  }

  return false;
};
