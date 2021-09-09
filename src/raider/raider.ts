import moment from 'moment-timezone';

import log from '../log';
import { CharacterInfo, MythicRunDetails } from './module';
import { fetchCharacterProfile, fetchCharacterDetails, runCrawlerAndGetBatchId, fetchScanStatus } from './api';
import { CharacterName } from '../battlenet/character';
import ScanMonitor from './monitor';
import { getWeekForDate } from '../affixes/weeks';

export const getCharacterInfo = async (characterName: CharacterName): Promise<CharacterInfo | null> => {
  try {
    const profile = await fetchCharacterProfile(characterName);
    const details = await fetchCharacterDetails(characterName);

    const currentWeek = getWeekForDate(moment());
    const recentRuns = profile['mythic_plus_recent_runs'].map(r => mapMythicRun(r));
    const runsThisWeek = recentRuns.filter(r => r.week.weekNumber === currentWeek.weekNumber);
    const bestRuns = profile['mythic_plus_best_runs'].map(r => mapMythicRun(r)).reduce((m, o) => {
      m[o.dungeon] = o;
      return m;
    }, {});
    const alternateRuns = profile['mythic_plus_alternate_runs'].map(r => mapMythicRun(r)).reduce((m, o) => {
      m[o.dungeon] = o;
      return m;
    }, {});

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
