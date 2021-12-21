import szynkaswinka from './responders/szynkaswinka';
import pumy from './responders/pumy';
import type { ResponderManifest } from './responders/module';
import type { BotMessageEvent } from './bot.d';

const Responders: ResponderManifest[] = [
  szynkaswinka,
  pumy
];

export const executeResponders = (event: BotMessageEvent) => {
  Responders.find(responder => {
    return responder.execute(event);
  });
};
