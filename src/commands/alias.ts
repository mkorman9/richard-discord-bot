import { parseCharacterName } from '../battlenet/character';
import { listAliases, defineAlias } from '../aliases/aliases';
import { sendReply } from './utils';
import type { CommandExecutionProps, CommandManifest } from './module';

const showHelp = (props: CommandExecutionProps) => {
  sendReply(props.event.message, 'alias/help.twig');
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
      listAliases(props.event.db)
        .then(aliases => {
          sendReply(props.event.message, 'alias/show.twig', { aliases });
        })
        .catch(err => {});
      return;
    }

    const alias = (props.args[1] || '');
    const nameRaw = (props.args[2] || '');
    const characterName = parseCharacterName(nameRaw);

    if (!alias || !characterName) {
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

      defineAlias(alias, characterName, props.event.db)
        .then(() => {
          sendReply(props.event.message, 'alias/added.twig');
        })
        .catch(err => {});
    } else {
      showHelp(props);
      return;
    }
  }
};

const alias: CommandManifest = {
  execute: callback
};

export default alias;
