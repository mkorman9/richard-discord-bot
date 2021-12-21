import { getCharacterInfo } from '../raider/raider';
import { resolveCharacterName, sendReply } from './utils';
import type { CommandExecutionProps, CommandManifest } from './module';

const showHelp = (props: CommandExecutionProps) => {
  sendReply(props.event.message, 'info/help.twig');
};

const callback = async (props: CommandExecutionProps) => {
  const nameRaw = props.args[0];
  if (!nameRaw) {
    showHelp(props);
    return;
  }

  try {
    const characterName = await resolveCharacterName(nameRaw, props.event.db);
    if (!characterName) {
      showHelp(props);
      return;
    }

    const character = await getCharacterInfo(characterName);
    if (!character) {
      sendReply(props.event.message, 'info/no_character.twig');
      return;
    }

    sendReply(props.event.message, 'info/show.twig', {
      character
    });
  } catch (err) {
  }
};

const info: CommandManifest = {
  execute: callback
};

export default info;
