import axios from 'axios';
import moment, { Moment, Duration } from 'moment-timezone';

import log from '../log';
import { BattleNetRegion } from '../config';
import { CharacterName } from '../battlenet/character';
import ScanMonitor from './monitor';
import { WeekDefinition, getWeekForDate } from '../affixes/weeks';

const CurrentSeason = 'season-sl-2';
const Region = BattleNetRegion || 'eu';
const ProfileFields = [
  'gear',
  'guild',
  'covenant',
  'mythic_plus_scores',
  'raid_progression',
  'raid_achievement_meta',
  'raid_achievement_curve',
  'mythic_plus_scores_by_season',
  'mythic_plus_ranks',
  'mythic_plus_recent_runs',
  'mythic_plus_best_runs',
  'mythic_plus_alternate_runs',
  'mythic_plus_highest_level_runs',
  'mythic_plus_weekly_highest_level_runs',
  'mythic_plus_previous_weekly_highest_level_runs'
];

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
    best: MythicRunDetails[];
    alternate: MythicRunDetails[];
  };

  lastUpdate: Moment | null;
}

export const getCharacterInfo = async (characterName: CharacterName): Promise<CharacterInfo | null> => {
  try {
    const profile = await fetchCharacterProfile(characterName);
    const details = await fetchCharacterDetails(characterName);

    const currentWeek = getWeekForDate(moment());
    const recentRuns = profile['mythic_plus_recent_runs'].map(r => mapMythicRun(r));
    const runsThisWeek = recentRuns.filter(r => r.week.weekNumber === currentWeek.weekNumber);
    const bestRuns = profile['mythic_plus_highest_level_runs'].map(r => mapMythicRun(r));
    const alternateRuns = profile['mythic_plus_alternate_runs'].map(r => mapMythicRun(r));

    return {
      id: details['id'],
      name: characterName,
      faction: profile['faction'],
      gender: profile['gender'],
      race: profile['race'],
      class: profile['class'],
      spec: profile['active_spec_name'],
      level: details['level'],
      itemLevel: profile['gear']['item_level_equipped'],
      guild: profile['guild'] ? {
        id: details['guild']['id'],
        name: profile['guild']['name']
      } : null,
      realm: {
        id: details['realm']['id'],
        name: profile['realm']['name'],
        locale: details['realm']['locale']
      },
      covenant: profile['covenant'] ? {
        name: profile['covenant']['name'],
        renown: profile['covenant']['renown_level'],
        soulbind: details['covenant']['soulbind']['name']
      } : null,
      mythicRuns: {
        score: profile['mythic_plus_scores']['all'],
        rank: {
          overall: {
            world: profile['mythic_plus_ranks']['overall']['world'],
            region: profile['mythic_plus_ranks']['overall']['region'],
            realm: profile['mythic_plus_ranks']['overall']['realm']
          },
          class: {
            world: profile['mythic_plus_ranks']['class']['world'],
            region: profile['mythic_plus_ranks']['class']['region'],
            realm: profile['mythic_plus_ranks']['class']['realm']
          }
        },
        recent: recentRuns,
        thisWeek: runsThisWeek,
        best: bestRuns,
        alternate: alternateRuns
      },

      lastUpdate: profile['last_crawled_at'] ? moment(profile['last_crawled_at']) : null
    };
  } catch (err) {
    if (err.response) {
      if (err.response.status === 400) {
        return null;
      }
    }

    log.error(`could not fetch character information: ${err}`);
    throw err;
  }
};

export const scheduleScan = async (characterName: CharacterName): Promise<ScanMonitor | null> => {
  try {
    const details = await fetchCharacterDetails(characterName);
    const batchId = await runCrawlerAndGetBatchId(characterName, details['realm']['id']);
    return new ScanMonitor(() => fetchScanStatus(batchId));
  } catch (err) {
    if (err.response) {
      if (err.response.status === 400) {
        return null;
      }
    }

    log.error(`error while scheduling scan: ${err}`);
    throw err;
  }
};

const fetchCharacterDetails = async (characterName: CharacterName): Promise<{}> => {
  const response = await axios.get(
    `https://raider.io/api/characters/${Region}/${characterName.realmSlug}/${characterName.name}`,
    {
      params: {
        season: CurrentSeason
      }
    }
  );
  return response.data['characterDetails']['character'];
};

const fetchCharacterProfile = async (characterName: CharacterName): Promise<{}> => {
  const response = await axios.get(
    'https://raider.io/api/v1/characters/profile',
    {
      params: {
        region: Region,
        realm: characterName.realmSlug,
        name: characterName.name,
        fields: [...ProfileFields].sort(() => Math.random() - 0.5).join(',')  // shuffle field to bypass Cloudflare cache
      }
    }
  );
  return response.data;
};

const runCrawlerAndGetBatchId = async (characterName: CharacterName, realmId: number): Promise<string> => {
  const response = await axios.post(
    'https://raider.io/api/crawler/characters',
    {
      realmId: realmId,
      realm: characterName.realm,
      region: Region,
      character: characterName.name
    }
  );
  return response.data['jobData']['batchId'];
};

const fetchScanStatus = async (batchId: string): Promise<string> => {
  const response = await axios.get(
    'https://raider.io/api/crawler/monitor',
    {
      params: {
        batchId: batchId
      }
    }
  );
  return response.data['batchInfo']['status'];
};

const mapMythicRun = (runData: {}): MythicRunDetails => {
  const completedAt = moment(runData['completed_at']);
  return {
    dungeon: runData['dungeon'],
    level: runData['mythic_level'],
    completedAt: completedAt,
    time: moment.duration(runData['clear_time_ms'], 'ms'),
    inTime: runData['clear_time_ms'] < runData['par_time_ms'],
    affixes: runData['affixes'].map(a => a['name']),
    basicAffix: runData['affixes'].find(a => a['name'] === 'Fortified' || a['name'] === 'Tyrannical')['name'],
    week: getWeekForDate(completedAt)
  };
};
