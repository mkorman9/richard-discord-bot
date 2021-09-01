import type { ResponderExecutionProps, ResponderManifest } from './module';

const callback = (props: ResponderExecutionProps) => {
  if (props.message.content.toLowerCase().includes('szynka')) {
    props.message.reply('> [...] szynka [...] \n\n świnka :D \n\n https://i.kym-cdn.com/entries/icons/original/000/008/001/Spurdo.jpg');
  }
};

const szynkaswinka: ResponderManifest = {
  execute: callback
};

export default szynkaswinka;
