function getToday(shortDate = true) {
  const today = new Date();
  if (shortDate) {
    return today.toISOString().split('T')[0];
  }
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  const [weekday, currentMonthDay, year] = formattedDate.split(', ');
  const [month, day] = currentMonthDay.split(' ');

  return { formattedDate, weekday, month, day, year };
}

function getDay(date, shortDate = true) {
  const newDate = new Date(date);
  if (shortDate) {
    return newDate.toISOString().split('T')[0];
  }
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = newDate.toLocaleDateString('en-US', options);
  const [weekday, currentMonthDay, year] = formattedDate.split(', ');
  const [month, day] = currentMonthDay.split(' ');

  return { formattedDate, weekday, month, day, year };
}

function getWeekDays(startDate) {
  const days = [];

  for (let i = 0; i < 7; i += 1) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const weekday = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
    const day = currentDate.getDate();
    const fullFormat = currentDate.toLocaleDateString('lt-LT', { year: 'numeric', month: 'numeric', day: 'numeric' });
    days.push({ weekday, day, fullFormat });
  }

  return days;
}

function getThisWeek() {
  const todaysDate = new Date();
  const startOfWeek = new Date(todaysDate);
  const diff = todaysDate.getDate() - todaysDate.getDay() + (todaysDate.getDay() === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  return getWeekDays(startOfWeek);
}

function getPrevWeek(date) {
  const startOfWeek = new Date(date);
  const diff = startOfWeek.getDate() - startOfWeek.getDay() - 6;
  startOfWeek.setDate(diff);

  return getWeekDays(startOfWeek);
}

function getNextWeek(date) {
  const startOfWeek = new Date(date);
  const diff = startOfWeek.getDate() - startOfWeek.getDay() + 8;
  startOfWeek.setDate(diff);

  return getWeekDays(startOfWeek);
}

function isFuture(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate.getTime() > today.getTime();
}

function isPast(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate.getTime() < today.getTime();
}

export { getToday, getThisWeek, getPrevWeek, getNextWeek, isFuture, isPast, getDay };
