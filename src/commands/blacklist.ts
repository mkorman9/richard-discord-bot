import log from '../log';
import { formatPlayerName, sendReply } from './utils';
import type { CommandExecutionProps, CommandManifest } from './module';

const displayBlacklist = (props: CommandExecutionProps) => {
  props.event.db.all('SELECT player, reason FROM blacklist', [], function (err, rows) {
    if (err) {
      log.error(`failed to retrieve blacklist entries: ${err}`);
      return;
    }

    sendReply(props.event.message, 'blacklist/display.twig', {
      blacklist: { entries: rows }
    });
  });
};

const addToBlacklist = (props: CommandExecutionProps, playerName: string, reason: string) => {
  props.event.db.run('INSERT INTO blacklist(player, reason) VALUES (?, ?)', [playerName, reason], function (err) {
    if (err) {
      if (err.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: blacklist.player') {
        sendReply(props.event.message, 'blacklist/add_duplicate.twig', {
          player: playerName
        });
        return;
      }

      log.error(`failed to add blacklist entry: ${err}`);
      return;
    }

    sendReply(props.event.message, 'blacklist/add_success.twig', {
      player: playerName
    });
  });
};

const removeFromBlacklist = (props: CommandExecutionProps, playerName: string) => {
  props.event.db.run('DELETE FROM blacklist WHERE player = ?', [playerName], function (err) {
    if (err) {
      log.error(`failed to delete blacklist entry: ${err}`);
      return;
    }

    if (this.changes > 0) {
      sendReply(props.event.message, 'blacklist/remove_success.twig', {
        player: playerName
      });
    } else {
      sendReply(props.event.message, 'blacklist/remove_missing.twig', {
        player: playerName
      });
    }
  });
};

const searchInBlacklist = (props: CommandExecutionProps, playerName: string) => {
  props.event.db.all('SELECT player, reason FROM blacklist WHERE player LIKE ? COLLATE NOCASE', ['%' + playerName + '%'], function (err, rows) {
    if (err) {
      log.error(`failed to retrieve blacklist entries: ${err}`);
      return;
    }

    sendReply(props.event.message, 'blacklist/search_results.twig', {
      blacklist: { entries: rows }
    });
  });
};

const showHelp = (props: CommandExecutionProps) => {
  sendReply(props.event.message, 'blacklist/help.twig');
};

const showAccessDenied = (props: CommandExecutionProps) => {
  sendReply(props.event.message, 'access_denied.twig');
};

const callback = (props: CommandExecutionProps) => {
  const cmd = (props.args[0] || '').toLowerCase();

  if (!cmd) {
    showHelp(props);
  } else {
    if (
      cmd === 'display' ||
      cmd === 'show' ||
      cmd === 'wyświetl' ||
      cmd === 'wyswietl' ||
      cmd === 'pokaż' ||
      cmd === 'pokaz'
    ) {
      displayBlacklist(props);
      return;
    }

    const playerName = (props.args[1] ? formatPlayerName(props.args[1]) : '');
    if (!playerName) {
      showHelp(props);
      return;
    }

    if (
      cmd === 'add' ||
      cmd === '+' ||
      cmd === 'dodaj'
    ) {
      if (!props.caller.isPrivileged) {
        showAccessDenied(props);
        return;
      }

      const reason = props.args.splice(2).join(' ');
      addToBlacklist(props, playerName, reason);
    } else if (
      cmd === 'remove' ||
      cmd === '-' ||
      cmd === 'usuń' ||
      cmd === 'usun'
    ) {
      if (!props.caller.isPrivileged) {
        showAccessDenied(props);
        return;
      }

      removeFromBlacklist(props, playerName);
    } else if (
      cmd === 'search' ||
      cmd === 'find' ||
      cmd === 'szukaj' ||
      cmd === 'znajdz' ||
      cmd === 'znajdź' ||
      cmd === 'sprawdź' ||
      cmd === 'sprawdz'
    ) {
      searchInBlacklist(props, playerName);
    } else {
      showHelp(props);
    }
  }
};

const blacklist: CommandManifest = {
  execute: callback
};

export default blacklist;
