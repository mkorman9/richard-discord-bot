import twig from '../templates';
import { parseCharacterName } from '../battlenet/character';
import { listAliases, defineAlias } from '../aliases/aliases';
import type { CommandExecutionProps, CommandManifest } from './module';

const showHelp = (props: CommandExecutionProps) => {
  twig.render('alias_help.twig', {})
    .then(output => {
      props.message.reply(output);
    });
};

const showAccessDenied = (props: CommandExecutionProps) => {
  twig.render('access_denied.twig', {})
    .then(output => {
      props.message.reply(output);
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
      listAliases()
        .then(aliases => {
          twig.render('alias_show.twig', { aliases })
            .then(output => {
              props.message.reply(output);
            });
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
          twig.render('alias_added.twig', {})
            .then(output => {
              props.message.reply(output);
            });
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
