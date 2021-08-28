import splitargs from 'splitargs2';
import type { Message } from 'discord.js';

import { PrivilegedRoles } from './config';
import richard from './commands/richard';
import affixes from './commands/affixes';
import blacklist from './commands/blacklist';
import drop from './commands/drop';
import legendary from './commands/legendary';

import type { CommandManifest, CommandCallerProps } from './commands/module';

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
  'czarnolisto': blacklist,

  'drop': drop,

  'legendary': legendary,
  'legendarka': legendary
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
    const caller = extractCallerInfo(trigger);

    commandsList.get(command).execute({
      command,
      args,
      caller,
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

const extractCallerInfo = (msg: Message): CommandCallerProps => {
  return {
    id: msg.author.id,
    name: `${msg.author.username}#${msg.author.discriminator}`,
    alias: msg.member.displayName,
    isPrivileged: msg.member.roles.cache.find(role => PrivilegedRoles.has(role.name)) !== undefined
  };
};
