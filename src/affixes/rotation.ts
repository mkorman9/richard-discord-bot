import moment from 'moment';
import Affixes from './affixes';

const Rotation = [
  [Affixes.Tyrannical, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Tormented],
  [Affixes.Tyrannical, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Tormented],
  [Affixes.Tyrannical, Affixes.Bursting, Affixes.Volcanic, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Spiteful, Affixes.Grievous, Affixes.Tormented],
  [Affixes.Tyrannical, null, null, Affixes.Tormented],
  [Affixes.Fortified, null, null, Affixes.Tormented],
  [Affixes.Tyrannical, null, null, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Tormented],
  [Affixes.Tyrannical, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Tormented]
];

const RotationStart = moment.unix(1606863600);
const EuDelay = 3;

export const getAffixesForWeekNumber = (weekNumber: number) => {
  return (weekNumber + EuDelay) % Rotation.length;
};

export const getAffixesForRelativeWeek = (n: number) => {
  const sinceStart = moment.duration(moment().diff(RotationStart));
  const weekNumber = Math.floor(sinceStart.asWeeks());
  return getAffixesForWeekNumber(weekNumber + n);
};

export const getAffixesForCurrentWeek = () => {
  return getAffixesForRelativeWeek(0);
};

export const getAffixesForNextWeek = () => {
  return getAffixesForRelativeWeek(1);
};
