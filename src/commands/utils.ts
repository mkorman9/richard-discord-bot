import type { Message } from 'discord.js';

import { CharacterName, parseCharacterName } from '../battlenet/character';
import { resolveAlias } from '../aliases/aliases';
import twig from '../templates';
import { Database } from 'sqlite3';

export const sendReply = async (message: Message, template: string, context: any = {}): Promise<void> => {
  const content = await twig.render(template, context);
  message.reply(content);
};

export const resolveCharacterName = async (name: string, db: Database): Promise<CharacterName | null> => {
  const fromAlias = await resolveAlias(name, db);
  if (fromAlias) {
    return fromAlias;
  }

  const fromName = parseCharacterName(name);
  if (fromName) {
    return fromName;
  }

  return null;
};

export const formatPlayerName = (playerName: string): string => {
  return playerName
    .split('-')
    .filter(s => s.length > 0)
    .map(s => capitalize(s))
    .join('-');
};

const capitalize = (str: string): string => {
  return str
    .split(' ')
    .filter(s => s.length > 0)
    .map(s => s[0].toUpperCase() + s.slice(1).toLowerCase())
    .join(' ');
};
