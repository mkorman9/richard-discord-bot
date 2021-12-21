import { scheduleJob, RecurrenceRule, gracefulShutdown } from 'node-schedule';
import type { TextBasedChannels } from 'discord.js';

import { Timezone } from './config';

import newWeek from './schedulers/new_week';
import type { SchedulerRule, SchedulerExecutionProps, SchedulerManifest } from './schedulers/module';

const Schedulers: SchedulerManifest[] = [
  newWeek
];

export const enableSchedulers = (announcementsChannel: TextBasedChannels) => {
  Schedulers.forEach(scheduler => {
    const rule = createRule(scheduler.rule);

    scheduleJob(rule, () => {
      const props: SchedulerExecutionProps = {
        announcementsChannel
      };

      scheduler.execute(props);
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
