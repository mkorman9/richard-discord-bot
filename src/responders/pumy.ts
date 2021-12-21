import type { ResponderManifest } from './module';
import type { BotMessageEvent } from '../bot.d';

const callback = (event: BotMessageEvent): boolean => {
  if (event.message.content.search(/(\b|[^\w])pumy(\b|[^\w])/i) >= 0) {
    event.message.reply('> [...] pumy [...] \n\n co ma jaja z gumy? :D \n\n https://i.kym-cdn.com/photos/images/original/000/249/522/b80.jpg');
    return true;
  }

  return false;
};

const pumy: ResponderManifest = {
  execute: callback
};

export default pumy;
