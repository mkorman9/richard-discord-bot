import type { BotMessageEvent } from '../bot.d';

export interface ResponderManifest {
  execute: (event: BotMessageEvent) => boolean;
}
