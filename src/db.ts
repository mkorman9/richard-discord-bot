import path from 'path';
const sqlite3 = require('sqlite3').verbose();

import { DatabaseDirectory } from './config';
import log from './log';

const DatabaseLocation = path.join(DatabaseDirectory, 'db.sqlite3');

const openDatabase = () => {
  return new sqlite3.Database(DatabaseLocation, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
    if (err) {
      log.error(`error while opening the database: ${err.message}`);
      process.exit(1);
    }
  });
};

const DB = openDatabase();

const initializeSchema = () => {
  log.info('initializing database schema');

  DB.serialize(function () {
    DB.run('CREATE TABLE IF NOT EXISTS blacklist (player TEXT UNIQUE, reason TEXT)', [], function (err) {
      if (err) {
        log.error(`failed to create table blacklist: ${err}`);
        return;
      }
    });

    DB.run('CREATE TABLE IF NOT EXISTS aliases (alias TEXT UNIQUE, name TEXT, realm TEXT, realm_slug TEXT, full TEXT)', [], function (err) {
      if (err) {
        log.error(`failed to create table aliases: ${err}`);
        return;
      }
    });
  });
};

DB.serialize(() => {
  DB.get('SELECT 1+1', [], function (err) {
    if (err) {
      log.error(`ping to the database has failed: ${err}`);
      process.exit(1);
    }

    log.info('successfully connected to the database');

    initializeSchema();
  });
});

export default DB;
