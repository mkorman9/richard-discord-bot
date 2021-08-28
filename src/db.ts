import fs from 'fs';
import path from 'path';
const sqlite3 = require('sqlite3').verbose();

import { DB_DIR_LOCATION } from './config';
import log from './log';

const DB_LOCATION = path.join(DB_DIR_LOCATION, 'db.sqlite3');

const needToInitializeSchema = ((): boolean => {
  try {
    return !fs.existsSync(DB_LOCATION);
  } catch (err) {
    log.error(`error while opening database file (${DB_LOCATION}): ${err}`);
  }
})();

const openDatabase = () => {
  return new sqlite3.Database(DB_LOCATION, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
    if (err) {
      log.error(`error while opening the database: ${err.message}`);
      process.exit(1);
    }
  });
};

const DB = openDatabase();

const initializeSchema = () => {
  log.info('initializing database schema');

  DB.serialize(() => {
    DB.run('CREATE TABLE blacklist (player TEXT UNIQUE, reason TEXT)');
  });
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
