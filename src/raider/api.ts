import axios from 'axios';

import { BattleNetRegion } from '../config';
import { CharacterName } from '../battlenet/character';

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
  'mythic_plus_best_runs:all',
  'mythic_plus_alternate_runs:all',
  'mythic_plus_highest_level_runs',
  'mythic_plus_weekly_highest_level_runs',
  'mythic_plus_previous_weekly_highest_level_runs'
];

export const fetchCharacterDetails = async (characterName: CharacterName): Promise<{}> => {
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

export const fetchCharacterProfile = async (characterName: CharacterName): Promise<{}> => {
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

export const runCrawlerAndGetBatchId = async (characterName: CharacterName, realmId: number): Promise<string> => {
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

export const fetchScanStatus = async (batchId: string): Promise<string> => {
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
