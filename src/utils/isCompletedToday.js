import { getToday } from './timeCalculations';

const isCompletedToday = habit => {
  const todayDate = getToday();
  return habit.days.some(day => day.date === todayDate && day.status);
};

export default isCompletedToday;
