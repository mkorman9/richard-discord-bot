import twig from '../templates';
import DB from '../db';
import log from '../log';
import { formatPlayerName } from './utils';
import type { CommandExecutionProps, CommandManifest } from './module';

const displayBlacklist = (props: CommandExecutionProps) => {
  DB.all('SELECT player, reason FROM blacklist', [], (err, rows) => {
    if (err) {
      log.error(`failed to retrieve blacklist entries: ${err}`);
      return;
    }

    twig.render('blacklist_display.twig', {
      blacklist: { entries: rows }
    })
      .then(output => {
        props.trigger.channel.send(output);
      });
  });
};

const addToBlacklist = (props: CommandExecutionProps, playerName: string, reason: string) => {
  DB.run('INSERT INTO blacklist(player, reason) VALUES (?, ?)', [playerName, reason], (err) => {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        twig.render('blacklist_add_duplicate.twig', {
          player: playerName
        })
          .then(output => {
            props.trigger.channel.send(output);
          });
        return;
      }

      log.error(`failed to add blacklist entry: ${err}`);
      return;
    }

    twig.render('blacklist_add_success.twig', {
      player: playerName
    })
      .then(output => {
        props.trigger.channel.send(output);
      });
  });
};

const removeFromBlacklist = (props: CommandExecutionProps, playerName: string) => {
  DB.run('DELETE FROM blacklist WHERE player = ?', [playerName], function (err) {
    if (err) {
      log.error(`failed to delete blacklist entry: ${err}`);
      return;
    }

    if (this.changes > 0) {
      twig.render('blacklist_remove_success.twig', {
        player: playerName
      })
        .then(output => {
          props.trigger.channel.send(output);
        });
    } else {
      twig.render('blacklist_remove_missing.twig', {
        player: playerName
      })
        .then(output => {
          props.trigger.channel.send(output);
        });
    }
  });
};

const searchInBlacklist = (props: CommandExecutionProps, playerName: string) => {
  DB.all('SELECT player, reason FROM blacklist WHERE player LIKE ? COLLATE NOCASE', ['%' + playerName + '%'], (err, rows) => {
    if (err) {
      log.error(`failed to retrieve blacklist entries: ${err}`);
      return;
    }

    twig.render('blacklist_search_results.twig', {
      blacklist: { entries: rows }
    })
      .then(output => {
        props.trigger.channel.send(output);
      });
  });
};

const showHelp = (props: CommandExecutionProps) => {
  twig.render('blacklist_help.twig', {})
    .then(output => {
      props.trigger.channel.send(output);
    });
};

const showAccessDenied = (props: CommandExecutionProps) => {
  twig.render('access_denied.twig', {})
    .then(output => {
      props.trigger.channel.send(output);
    });
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
