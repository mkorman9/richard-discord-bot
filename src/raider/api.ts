import axios from 'axios';
import moment, { Moment, Duration } from 'moment-timezone';

import log from '../log';
import { BattleNetRegion } from '../config';
import { CharacterName } from '../battlenet/character';
import ScanMonitor from './monitor';

const CurrentSeason = 'season-sl-2';
const Region = BattleNetRegion || 'eu';

export interface MythicRunDetails {
  dungeon: string;
  level: number;
  time: Duration;
  inTime: boolean;
  affixes: string[];
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
  };
  realm: {
    id: number;
    locale: string;
  };
  covenant: {
    name: string;
    renown: number;
    soulbind: string;
  };
  mythicRuns: {
    score: number;
    thisWeek: MythicRunDetails[];
  };

  lastUpdate: Moment | null;
}

export const getCharacterInfo = async (character: CharacterName): Promise<CharacterInfo | null> => {
  try {
    const details = await fetchCharacterDetails(character);
    const characterData = details['character'];
    const mythicRunsData = details['mythicPlusScores'];
    const metaData = details['meta'];

    const runsThisWeek = await fetchMythicRunsThisWeek(characterData['id']);

    return {
      id: characterData['id'],
      name: character,
      faction: characterData['faction'],
      gender: characterData['gender'],
      race: characterData['race']['name'],
      class: characterData['class']['name'],
      spec: characterData['spec']['name'],
      level: characterData['level'],
      itemLevel: characterData['itemLevelEquipped'],
      guild: {
        id: characterData['guild']['id'],
        name: characterData['guild']['name']
      },
      realm: {
        id: characterData['realm']['id'],
        locale: characterData['realm']['locale']
      },
      covenant: {
        name: characterData['covenant']['name'],
        renown: characterData['covenant']['renownLevel'],
        soulbind: characterData['covenant']['soulbind']['name']
      },
      mythicRuns: {
        score: mythicRunsData['all']['score'],
        thisWeek: runsThisWeek.map(run => {
          return {
            dungeon: run['summary']['dungeon']['name'],
            level: run['summary']['mythic_level'],
            time: moment.duration(run['summary']['clear_time_ms'], 'ms'),
            inTime: run['summary']['time_remaining_ms'] >= 0,
            affixes: run['summary']['weekly_modifiers'].map(a => a['name'])
          };
        })
      },

      lastUpdate: metaData['lastCrawledAt'] ? moment(metaData['lastCrawledAt']) : null
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

export const scheduleScan = async (character: CharacterInfo): Promise<ScanMonitor> => {
  const batchId = await runCrawlerAndGetBatchId(character);
  return new ScanMonitor(() => fetchScanStatus(batchId));
};

const fetchCharacterDetails = async (character: CharacterName): Promise<{}> => {
  const response = await axios.get(
    `https://raider.io/api/characters/${Region}/${character.realmSlug}/${character.name}?season=${CurrentSeason}`
  );
  return response.data['characterDetails'];
};

const fetchMythicRunsThisWeek = async (characterId: number): Promise<{}[]> => {
  const response = await axios.get(
    `https://raider.io/api/characters/mythic-plus-runs?season=${CurrentSeason}&characterId=${characterId}&role=all&affixes=all&date=this_week`
  );
  return response.data['runs'];
};

const runCrawlerAndGetBatchId = async (character: CharacterInfo): Promise<string> => {
  const response = await axios.post(
    'https://raider.io/api/crawler/characters',
    {
      realmId: character.realm.id,
      realm: character.name.realm,
      region: Region,
      character: character.name.name
    }
  );
  return response.data['jobData']['batchId'];
};

const fetchScanStatus = async (batchId: string): Promise<string> => {
  const response = await axios.get(
    `https://raider.io/api/crawler/monitor?batchId=${batchId}`
  );
  return response.data['batchInfo']['status'];
};
