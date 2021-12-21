import log from '../log';
import { CharacterName } from '../battlenet/character';
import { Database } from 'sqlite3';

export const listAliases = async (db: Database): Promise<Map<string, CharacterName>> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT alias, name, realm, realm_slug, full FROM aliases', [], function (err, rows) {
      if (err) {
        log.error(`failed to retrieve aliases: ${err}`);
        reject(err);
        return;
      }

      const result = new Map<string, CharacterName>();
      rows.forEach(row => {
        result.set(
          row['alias'],
          {
            name: row['name'],
            realm: row['realm'],
            realmSlug: row['realm_slug'],
            full: row['full']
          }
        );
      });

      resolve(result);
    });
  });
};

export const resolveAlias = async (alias: string, db: Database): Promise<CharacterName | null> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT name, realm, realm_slug, full FROM aliases WHERE alias = ?', [alias], function (err, row) {
      if (err) {
        log.error(`failed to resolve alias: ${err}`);
        reject(err);
        return;
      }

      if (!row) {
        resolve(null);
        return;
      }

      resolve({
        name: row['name'],
        realm: row['realm'],
        realmSlug: row['realm_slug'],
        full: row['full']
      });
    });
  });
};

export const defineAlias = async (alias: string, characterName: CharacterName, db: Database): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR REPLACE INTO aliases(alias, name, realm, realm_slug, full) VALUES (?, ?, ?, ?, ?)',
      [alias, characterName.name, characterName.realm, characterName.realmSlug, characterName.full],
      function (err) {
        if (err) {
          log.error(`failed to define alias: ${err}`);
          reject(err);
          return;
        }

        resolve();
      }
    );
  });
};
