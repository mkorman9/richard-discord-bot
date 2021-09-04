import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import moment, { Moment } from 'moment-timezone';

import { BattleNetRegion } from '../config';
import log from '../log';
import TokenStore from './token_store';
import { GoldAmount, calculateGoldAmount } from './gold';

type Namespace = 'static' |
  'dynamic' |
  'profile';

export interface WowTokenPrice {
  lastUpdated: Moment;
  price: GoldAmount;
}

const Token = new TokenStore();

const callApi = async (endpoint: string, namespace: Namespace = 'static', options?: AxiosRequestConfig): Promise<AxiosResponse> => {
  const accessToken = await Token.get();
  let config = {
    ...options,
    ...{
      url: `https://${BattleNetRegion}.api.blizzard.com${endpoint.startsWith('/') ? endpoint : ('/' + endpoint)}?namespace=${namespace}-${BattleNetRegion}`
    }
  };

  if (!config.headers) {
    config.headers = {};
  }
  config.headers['Authorization'] = `Bearer ${accessToken}`;

  return await axios.request(config);
};

export const getWowTokenPrice = async (): Promise<WowTokenPrice> => {
  try {
    const response = await callApi('/data/wow/token/', 'dynamic');
    return {
      lastUpdated: moment.unix(Math.floor(parseInt(response.data['last_updated_timestamp']) / 1000)),
      price: calculateGoldAmount(parseInt(response.data['price']))
    };
  } catch (err) {
    log.error(`failed to retrieve Wow Token price: ${err}`);
    throw err;
  }
};
