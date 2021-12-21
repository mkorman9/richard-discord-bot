import type { Message } from 'discord.js';

import szynkaswinka from './responders/szynkaswinka';
import pumy from './responders/pumy';
import type { ResponderManifest } from './responders/module';

const Responders: ResponderManifest[] = [
  szynkaswinka,
  pumy
];

export const executeResponders = (message: Message) => {
  Responders.find(responder => {
    return responder.execute({
      message
    });
  });
};
