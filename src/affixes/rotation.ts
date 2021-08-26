import { Moment } from 'moment';
import Affixes from './affixes';
import { getWeekForDate, WeekDefinition } from './weeks';
import type { AffixDefinition } from './affixes';

export interface WeekRotationDefinition {
  affixes: AffixDefinition[];
  week: WeekDefinition;
}

const Rotation: AffixDefinition[][] = [
  [Affixes.Tyrannical, Affixes.Spiteful, Affixes.Necrotic, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Bolstering, Affixes.Quaking, Affixes.Tormented],
  [Affixes.Tyrannical, Affixes.Sanguine, Affixes.Storming, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Raging, Affixes.Explosive, Affixes.Tormented],
  [Affixes.Tyrannical, Affixes.Bursting, Affixes.Volcanic, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Spiteful, Affixes.Grievous, Affixes.Tormented],
  [Affixes.Tyrannical, Affixes.Unknown, Affixes.Unknown, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Unknown, Affixes.Unknown, Affixes.Tormented],
  [Affixes.Tyrannical, null, null, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Grievous, Affixes.Storming, Affixes.Tormented],
  [Affixes.Tyrannical, Affixes.Raging, Affixes.Volcanic, Affixes.Tormented],
  [Affixes.Fortified, Affixes.Inspiring, Affixes.Grievous, Affixes.Tormented]
];

const EuDelay = 3;

const getAffixesForWeekNumber = (weekNumber: number): AffixDefinition[] => {
  return Rotation[(weekNumber + EuDelay) % Rotation.length];
};

export const getRotationForDate = (date: Moment): WeekRotationDefinition => {
  const week = getWeekForDate(date);

  return {
    affixes: getAffixesForWeekNumber(week.weekNumber),
    week
  };
};
