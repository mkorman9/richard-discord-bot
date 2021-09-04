export interface CharacterName {
  name: string;
  realm: string;
  realmSlug: string;
  full: string;
}

export const parseCharacterName = (str: string): (CharacterName | null) => {
  const parts = str.split('-')
    .filter(p => p.length > 0);
  if (parts.length !== 2) {
    return null;
  }

  const name = parts[0][0].toUpperCase().trim() + parts[0].slice(1).toLowerCase().trim();
  const realm = parts[1].split(/\s/)
    .filter(p => p.length > 0)
    .map(p => p[0].toUpperCase().trim() + p.slice(1).toLowerCase().trim())
    .join(' ');
  const realmSlug = realm.toLowerCase().replace(' ', '-');

  if (name.search(/\s/) >= 0) {
    return null;
  }

  return {
    name,
    realm,
    realmSlug,
    full: `${name}-${realm}`
  };
};
