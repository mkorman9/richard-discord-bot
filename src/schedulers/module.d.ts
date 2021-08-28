import type { TextBasedChannels } from 'discord.js';

export interface SchedulerRule {
  second?: number;
  minute?: number;
  hour?: number;
  date?: number;
  month?: number;
  year?: number;
  dayOfWeek?: number;
}

export interface SchedulerExecutionProps {
  announcementsChannel: TextBasedChannels;
}

export interface SchedulerManifest {
  execute: (props: SchedulerExecutionProps) => void;
  rule: SchedulerRule;
}
