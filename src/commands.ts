import splitargs from 'splitargs2';
import type { Message } from 'discord.js';

import { PrivilegedRoles } from './config';
import richard from './commands/richard';
import affixes from './commands/affixes';
import blacklist from './commands/blacklist';
import drop from './commands/drop';
import legendary from './commands/legendary';
import playlist from './commands/playlist';
import wowtoken from './commands/wowtoken';
import info from './commands/info';
import scan from './commands/scan';
import alias from './commands/alias';

import type { CommandManifest, CommandCallerProps } from './commands/module';
import type { BotMessageEvent } from './bot.d';

export type CommandCallback = (event: BotMessageEvent) => void;
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
  'legendarka': legendary,

  'playlist': playlist,
  'playlista': playlist,

  'wowtoken': wowtoken,

  'info': info,

  'scan': scan,
  'skan': scan,

  'alias': alias
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

  return (event: BotMessageEvent) => {
    const caller = extractCallerInfo(event);

    commandsList.get(command).execute({
      command,
      args,
      caller,
      event
    });
  };
};

export const executeCommand = (command: string, event: BotMessageEvent): boolean => {
  const cmd = parseCommand(command);
  if (cmd) {
    cmd(event);
    return true;
  }

  return false;
};

const extractCallerInfo = (event: BotMessageEvent): CommandCallerProps => {
  return {
    id: event.message.author.id,
    name: `${event.message.author.username}#${event.message.author.discriminator}`,
    alias: event.message.member.displayName,
    isPrivileged: event.message.member.roles.cache.find(role => PrivilegedRoles.has(role.name)) !== undefined
  };
};
