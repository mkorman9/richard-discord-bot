import type { Moment, Duration } from 'moment-timezone';

import type { CharacterName } from '../battlenet/character';
import type { WeekDefinition } from '../affixes/weeks';

export interface MythicRunDetails {
  dungeon: string;
  level: number;
  completedAt: Moment;
  time: Duration;
  inTime: boolean;
  affixes: string[];
  basicAffix: string;
  week: WeekDefinition;
}

export interface CharacterInfo {
  id: number;
  name: CharacterName;
  faction: string;
  gender: string;
  race: string;
  class: string;
  spec: string;
  level: number;
  itemLevel: number;
  guild: {
    id: number;
    name: string;
  } | null;
  realm: {
    id: number;
    name: string;
    locale: string;
  };
  covenant: {
    name: string;
    renown: number;
    soulbind: string;
  } | null;
  mythicRuns: {
    score: number;
    rank: {
      overall: {
        world: number;
        region: number;
        realm: number;
      },
      class: {
        world: number;
        region: number;
        realm: number;
      }
    };
    recent: MythicRunDetails[];
    thisWeek: MythicRunDetails[];
    best: Map<string, MythicRunDetails>;
    alternate: Map<string, MythicRunDetails>;
  };

  lastUpdate: Moment | null;
}
