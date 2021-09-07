import twig from '../templates';
import { getCharacterInfo } from '../raider/api';
import { resolveCharacterName } from './utils';
import type { CommandExecutionProps, CommandManifest } from './module';

const showHelp = (props: CommandExecutionProps) => {
  twig.render('info_help.twig', {})
    .then(output => {
      props.message.reply(output);
    });
};

const callback = async (props: CommandExecutionProps) => {
  const nameRaw = props.args[0];
  if (!nameRaw) {
    showHelp(props);
    return;
  }

  try {
    const characterName = await resolveCharacterName(nameRaw);
    if (!characterName) {
      showHelp(props);
      return;
    }

    const character = await getCharacterInfo(characterName);
    if (!character) {
      twig.render('info_nocharacter.twig', {})
        .then(output => {
          props.message.reply(output);
        });
      return;
    }

    twig.render('info_show.twig', {
      character
    })
      .then(output => {
        props.message.reply(output);
      });
  } catch (err) {
  }
};

const info: CommandManifest = {
  execute: callback
};

export default info;
