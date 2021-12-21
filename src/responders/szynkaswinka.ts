import type { ResponderManifest } from './module';
import type { BotMessageEvent } from '../bot.d';

const callback = (event: BotMessageEvent): boolean => {
  if (event.message.content.search(/(\b|[^\w])szynka(\b|[^\w])/i) >= 0) {
    event.message.reply('> [...] szynka [...] \n\n świnka :D \n\n https://i.kym-cdn.com/entries/icons/original/000/008/001/Spurdo.jpg');
    return true;
  }

  return false;
};

const szynkaswinka: ResponderManifest = {
  execute: callback
};

export default szynkaswinka;
