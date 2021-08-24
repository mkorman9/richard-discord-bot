import moment from 'moment';
import Affixes from './affixes';
import type { AffixDefinition } from './affixes';

type WeekRotation = AffixDefinition[] | null;

const Rotation: WeekRotation[] = [
  [Affixes.Tyrannical, Affixes.Spiteful, Affixes.Necrotic, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Bolstering, Affixes.Quaking, Affixes.Tormented],
  [Affixes.Tyrannical, Affixes.Sanguine, Affixes.Storming, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Raging, Affixes.Explosive, Affixes.Tormented],
  [Affixes.Tyrannical, Affixes.Bursting, Affixes.Volcanic, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Spiteful, Affixes.Grievous, Affixes.Tormented],
  [Affixes.Tyrannical, null, null, Affixes.Tormented],
  [Affixes.Fortified, null, null, Affixes.Tormented],
  [Affixes.Tyrannical, null, null, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Grievous, Affixes.Storming, Affixes.Tormented],
  [Affixes.Tyrannical, Affixes.Raging, Affixes.Volcanic, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Inspiring, Affixes.Grievous, Affixes.Tormented]
];

const RotationStart = moment.unix(1606863600);
const EuDelay = 3;

export const getAffixesForWeekNumber = (weekNumber: number): WeekRotation => {
  return Rotation[(weekNumber + EuDelay) % Rotation.length];
};

export const getAffixesForRelativeWeek = (n: number): WeekRotation => {
  const sinceStart = moment.duration(moment().diff(RotationStart));
  const weekNumber = Math.floor(sinceStart.asWeeks());
  return getAffixesForWeekNumber(weekNumber + n);
};

export const getAffixesForCurrentWeek = (): WeekRotation => {
  return getAffixesForRelativeWeek(0);
};

export const getAffixesForNextWeek = (): WeekRotation => {
  return getAffixesForRelativeWeek(1);
};
