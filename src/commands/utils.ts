import { CharacterName, parseCharacterName } from '../battlenet/character';
import { resolveAlias } from '../aliases/aliases';

export const resolveCharacterName = async (name: string): Promise<CharacterName | null> => {
  const fromAlias = await resolveAlias(name);
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
