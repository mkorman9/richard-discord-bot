import twig from '../templates';
import type { CommandExecutionProps, CommandManifest } from './module';

const displayBlacklist = (props: CommandExecutionProps) => {

};

const addToBlacklist = (props: CommandExecutionProps, playerName: string, reason: string) => {

};

const removeFromBlacklist = (props: CommandExecutionProps, playerName: string) => {

};

const searchInBlacklist = (props: CommandExecutionProps, playerName: string) => {

};

const callback = (props: CommandExecutionProps) => {
  if (props.args.length === 0) {
    displayBlacklist(props);
  } else {
    const cmd = props.args[0].toLowerCase();

    if (cmd === 'add' || cmd === '+' || cmd === 'dodaj') {
      addToBlacklist(props, props.args[1], props.args.splice(2).join(' '));
    } else if (cmd === 'remove' || cmd === '-' || cmd === 'usuń' || cmd === 'usun') {
      removeFromBlacklist(props, props.args[1]);
    } else {
      searchInBlacklist(props, props.args[0]);
    }
  }
};

const blacklist: CommandManifest = {
  execute: callback
};

export default blacklist;
