import type { BotContext } from '../bot.d';

export interface SchedulerRule {
  second?: number;
  minute?: number;
  hour?: number;
  date?: number;
  month?: number;
  year?: number;
  dayOfWeek?: number;
}

export interface SchedulerManifest {
  execute: (context: BotContext) => void;
  rule: SchedulerRule;
}
