import twig from '../templates';
import { getCharacterInfo } from '../raider/api';
import { parseCharacterName } from '../battlenet/character';
import type { CommandExecutionProps, CommandManifest } from './module';

const showHelp = (props: CommandExecutionProps) => {
  twig.render('info_help.twig', {})
    .then(output => {
      props.message.reply(output);
    });
};

const callback = (props: CommandExecutionProps) => {
  const nameRaw = props.args[0];
  if (!nameRaw) {
    showHelp(props);
    return;
  }

  const characterName = parseCharacterName(nameRaw);
  if (!characterName) {
    showHelp(props);
    return;
  }

  getCharacterInfo(characterName)
    .then(character => {
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
    })
    .catch(err => {});
};

const info: CommandManifest = {
  execute: callback
};

export default info;
