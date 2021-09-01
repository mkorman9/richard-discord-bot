import type { Message } from 'discord.js';

import szynkaswinka from './responders/szynkaswinka';
import type { ResponderManifest } from './responders/module';

const Responders: ResponderManifest[] = [
  szynkaswinka
];

export const executeResponders = (message: Message) => {
  Responders.forEach(responder => {
    responder.execute({
      message
    });
  });
};
