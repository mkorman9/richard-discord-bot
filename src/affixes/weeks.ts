import moment, { Moment } from 'moment';

export interface WeekDefinition {
  weekNumber: number;
  weekStart: Moment;
}

const RotationStart = moment.unix(1606863600);

export const getWeekForDate = (date: Moment): WeekDefinition => {
  const dateUtc = date.clone().utc();

  const sinceStart = moment.duration(dateUtc.diff(RotationStart));
  const weekNumber = Math.floor(sinceStart.asWeeks());
  const weekStart = RotationStart
    .add(weekNumber, 'weeks')
    .add(1, 'hour');

  return {
    weekNumber,
    weekStart
  };
};
