import { parseCharacterName } from '../battlenet/character';
import { listAliases, defineAlias } from '../aliases/aliases';
import { sendReply } from './utils';
import type { CommandExecutionProps, CommandManifest } from './module';

const showHelp = (props: CommandExecutionProps) => {
  sendReply(props.message, 'alias/help.twig');
};

const showAccessDenied = (props: CommandExecutionProps) => {
  sendReply(props.message, 'access_denied.twig');
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
      listAliases()
        .then(aliases => {
          sendReply(props.message, 'alias/show.twig', { aliases });
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

      defineAlias(alias, characterName)
        .then(() => {
          sendReply(props.message, 'alias/added.twig');
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
