import axios from 'axios';
import moment, { Moment } from 'moment-timezone';

import {
  BattleNetRegion,
  BattleNetClientId,
  BattleNetClientSecret
} from '../config';
import log from '../log';

interface CachedAccessToken {
  accessToken: string;
  expiresAt: Moment;
}

interface APITokenResponse {
  accessToken: string;
  expiresIn: number;
}

class TokenStore {
  private cachedAccessToken: CachedAccessToken | null = null;

  get(): Promise<string> {
    const that = this;

    return new Promise((resolve, reject) => {
      if (!BattleNetRegion || !BattleNetClientId || !BattleNetClientSecret) {
        reject(new Error('integration with Battle.Net is not configured'));
        return;
      }

      if (that.hasCachedToken()) {
        resolve(that.cachedAccessToken.accessToken);
        return;
      }

      that.getNewToken()
        .then(tokenResponse => {
          const token = {
            accessToken: tokenResponse.accessToken,
            expiresAt: moment().add(tokenResponse.expiresIn, 'seconds')
          };

          log.info(`acquired new Battle.net access token, it's valid until ${token.expiresAt.utc().format()}`);
          that.cachedAccessToken = token;

          resolve(token.accessToken);
        })
        .catch(err => {
          log.error(`failed to acquire Battle.Net access token: ${err}`);
          reject(err);
        });
    });
  }

  private hasCachedToken(): boolean {
    if (!this.cachedAccessToken) {
      return false;
    }

    return moment().isBefore(this.cachedAccessToken.expiresAt);
  }

  private getNewToken(): Promise<APITokenResponse> {
    return new Promise((resolve, reject) => {
      axios.post(
        `https://${BattleNetRegion}.battle.net/oauth/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          auth: {
            username: BattleNetClientId,
            password: BattleNetClientSecret
          }
        }
      )
        .then(response => {
          resolve({
            accessToken: response.data['access_token'],
            expiresIn: parseInt(response.data['expires_in'])
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export default TokenStore;
