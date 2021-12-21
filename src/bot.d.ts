import type { Client, Message } from 'discord.js';
import type { Database } from 'sqlite3';

export interface BotContext {
  client: Client;
  db: Database;
}

export interface BotReadyEvent extends BotContext {
}

export interface BotClosingEvent extends BotContext {
}

export interface BotMessageEvent extends BotContext {
  message: Message;
}
