import log from '../log';
import { getCharacterInfo, scheduleScan } from '../raider/api';
import { resolveCharacterName, sendReply } from './utils';
import type { CommandExecutionProps, CommandManifest } from './module';

const showHelp = (props: CommandExecutionProps) => {
  sendReply(props.message, 'scan/help.twig');
};

const showError = (props: CommandExecutionProps) => {
  sendReply(props.message, 'scan/error.twig');
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
      sendReply(props.message, 'scan/no_character.twig');
      return;
    }

    const scanMonitor = await scheduleScan(character);
    sendReply(props.message, 'scan/scheduled.twig');

    await scanMonitor.waitForEnd();

    const updatedCharacter = await getCharacterInfo(characterName);
    sendReply(props.message, 'scan/finished.twig', {
      character: updatedCharacter
    });
  } catch (err) {
    log.error(`error while performing scan: ${err}`, { stack: err.stack });
    showError(props);
    return;
  }
};

const scan: CommandManifest = {
  execute: callback
};

export default scan;
