import axios from 'axios';
import moment, { Moment } from 'moment-timezone';

import { BattleNetRegion } from '../config';
import { CharacterName } from '../battlenet/character';

const CurrentSeason = 'season-sl-2';
const Realm = BattleNetRegion || 'eu';

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
  };

  lastUpdate: Moment | null;
}

export const getCharacterInfo = async (character: CharacterName): Promise<CharacterInfo> => {
  try {
    const response = await axios.get(
      `https://raider.io/api/characters/${Realm}/${character.realmSlug}/${character.name}?season=${CurrentSeason}`
    );

    const characterData = response.data['characterDetails']['character'];
    const mythicRunsData = response.data['characterDetails']['mythicPlusScores'];
    const metaData = response.data['characterDetails']['meta'];

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
        score: mythicRunsData['all']['score']
      },

      lastUpdate: metaData['lastCrawledAt'] ? moment(metaData['lastCrawledAt']) : null
    };
  } catch (err) {
    throw err;
  }
};
