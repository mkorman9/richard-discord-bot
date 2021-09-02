import type { ResponderExecutionProps, ResponderManifest } from './module';

const callback = (props: ResponderExecutionProps): boolean => {
  if (props.message.content.search(/\bszynka\b/i) >= 0) {
    props.message.reply('> [...] szynka [...] \n\n świnka :D \n\n https://i.kym-cdn.com/entries/icons/original/000/008/001/Spurdo.jpg');
    return true;
  }

  return false;
};

const szynkaswinka: ResponderManifest = {
  execute: callback
};

export default szynkaswinka;
