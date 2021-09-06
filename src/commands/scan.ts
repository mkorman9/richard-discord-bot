import log from '../log';
import twig from '../templates';
import { getCharacterInfo, scheduleScan } from '../raider/api';
import { parseCharacterName } from '../battlenet/character';
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
    .then(async character => {
      if (!character) {
        twig.render('scan_nocharacter.twig', {})
          .then(output => {
            props.message.reply(output);
          });
        return;
      }

      try {
        const scanMonitor = await scheduleScan(character);

        twig.render('scan_scheduled.twig', {})
          .then(output => {
            props.message.reply(output);
          });

        scanMonitor.start(
          () => {
            twig.render('scan_finished.twig', {})
              .then(output => {
                props.message.reply(output);
              });
          },
          err => {
            log.error(`error while waiting for scan results: ${err}`, { stack: err.stack });
            showError(props);
            return;
          }
        );
      } catch (err) {
        log.error(`error while scheduling scan: ${err}`, { stack: err.stack });
        showError(props);
      }
    })
    .catch(err => {
      log.error(`error while retrieving realm id: ${err}`, { stack: err.stack });
      showError(props);
    });
};

const scan: CommandManifest = {
  execute: callback
};

export default scan;
