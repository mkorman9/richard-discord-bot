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
