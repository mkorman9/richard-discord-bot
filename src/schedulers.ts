import { scheduleJob, RecurrenceRule, gracefulShutdown } from 'node-schedule';

import { Timezone } from './config';

import newWeek from './schedulers/new_week';
import type { SchedulerRule, SchedulerManifest } from './schedulers/module';
import type { BotContext } from './bot.d';

const Schedulers: SchedulerManifest[] = [
  newWeek
];

export const enableSchedulers = (context: BotContext) => {
  Schedulers.forEach(scheduler => {
    const rule = createRule(scheduler.rule);

    scheduleJob(rule, () => {
      scheduler.execute(context);
    });
  });
};

export const disableSchedulers = async () => {
  await gracefulShutdown();
};

const createRule = (ruleDefinition: SchedulerRule): RecurrenceRule => {
  const rule = new RecurrenceRule();
  rule.tz = Timezone;

  if (ruleDefinition.second !== undefined) {
    rule.second = ruleDefinition.second;
  }
  if (ruleDefinition.minute !== undefined) {
    rule.minute = ruleDefinition.minute;
  }
  if (ruleDefinition.hour !== undefined) {
    rule.hour = ruleDefinition.hour;
  }
  if (ruleDefinition.date !== undefined) {
    rule.date = ruleDefinition.date;
  }
  if (ruleDefinition.month !== undefined) {
    rule.month = ruleDefinition.month;
  }
  if (ruleDefinition.year !== undefined) {
    rule.year = ruleDefinition.year;
  }
  if (ruleDefinition.dayOfWeek !== undefined) {
    rule.dayOfWeek = ruleDefinition.dayOfWeek;
  }

  return rule;
};
