import moment, { Moment } from 'moment';

export interface WeekDefinition {
  weekNumber: number;
  weekOfSeason: number;
  weekStart: Moment;
}

const RotationStart = moment.unix(1625036400);
const CurrentSeasonStart = moment.unix(1625529600);
const CurrentSeasonStartWeekNumber = Math.floor(moment.duration(CurrentSeasonStart.diff(RotationStart)).asWeeks());

export const getWeekForWeekNumber = (weekNumber: number): WeekDefinition => {
  const weekStart = RotationStart.clone()
    .add(weekNumber, 'weeks');
  const weekOfSeason = weekNumber - CurrentSeasonStartWeekNumber;

  return {
    weekNumber,
    weekOfSeason,
    weekStart
  };
};

export const getWeekForDate = (date: Moment): WeekDefinition => {
  const dateCopy = date.clone();
  const sinceRotationStart = moment.duration(dateCopy.diff(RotationStart));
  const weekNumber = Math.floor(sinceRotationStart.asWeeks());

  return getWeekForWeekNumber(weekNumber);
};
