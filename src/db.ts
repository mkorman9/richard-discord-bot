import fs from 'fs';
const sqlite3 = require('sqlite3').verbose();

import { DB_LOCATION } from './config';
import log from './log';

const needToInitializeSchema = ((): boolean => {
  try {
    return !fs.existsSync(DB_LOCATION);
  } catch (err) {
    log.error(`error while opening database file (${DB_LOCATION}): ${err}`);
  }
})();

const DB = new sqlite3.Database(DB_LOCATION);

const initializeSchema = () => {
  log.info('initializing database schema');

  DB.run('CREATE TABLE blacklist (player TEXT UNIQUE, reason TEXT)');
};

DB.serialize(() => {
  DB.get('SELECT 1+1', [], (err) => {
    if (err) {
      log.error(`ping to the database has failed: ${err}`);
      process.exit(1);
    }

    log.info('successfully connected to the database');

    if (needToInitializeSchema) {
      initializeSchema();
    }
  });
});

export default DB;
