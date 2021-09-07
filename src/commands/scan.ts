import log from '../log';
import twig from '../templates';
import { getCharacterInfo, scheduleScan } from '../raider/api';
import { resolveCharacterName } from './utils';
import type { CommandExecutionProps, CommandManifest } from './module';

const showHelp = (props: CommandExecutionProps) => {
  twig.render('scan_help.twig', {})
    .then(output => {
      props.message.reply(output);
    });
};

const showError = (props: CommandExecutionProps) => {
  twig.render('scan_error.twig', {})
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
      twig.render('scan_nocharacter.twig', {})
        .then(output => {
          props.message.reply(output);
        });
      return;
    }

    const scanMonitor = await scheduleScan(character);
    twig.render('scan_scheduled.twig', {})
      .then(output => {
        props.message.reply(output);
      });

    await scanMonitor.waitForEnd();

    const updatedCharacter = await getCharacterInfo(characterName);
    twig.render('scan_finished.twig', {
      character: updatedCharacter
    })
      .then(output => {
        props.message.reply(output);
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
