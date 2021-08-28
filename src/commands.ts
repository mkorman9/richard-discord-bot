import splitargs from 'splitargs2';
import type { Message } from 'discord.js';

import richard from './commands/richard';
import affixes from './commands/affixes';
import blacklist from './commands/blacklist';
import type { CommandManifest } from './commands/module';

export type CommandCallback = (trigger: Message) => void;
export type Command =
  CommandCallback
  | null;

const commandsList = new Map<string, CommandManifest>(Object.entries({
  'richard': richard,
  'ryszard': richard,

  'affixes': affixes,
  'affixy': affixes,

  'blacklist': blacklist,
  'czarnolisto': blacklist
}));

const parseCommand = (str: string): Command => {
  const parts = splitargs(str);
  if (!parts) {
    return null;
  }

  const command = parts[0].toLowerCase();
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
