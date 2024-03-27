const isOneDayEarlier = (date1, date2) => {
  const timestamp1 = new Date(date1).getTime();
  const timestamp2 = new Date(date2).getTime();
  const diff = timestamp2 - timestamp1;
  return diff === 24 * 60 * 60 * 1000;
};
const countStreakDays = data => {
  let newData = [];
  newData = data.map(item => {
    const updatedItem = { ...item };

    let streakCount = 0;

    for (let i = item.days.length - 1; i >= 0; i -= 1) {
      let isPrevDay = true;
      if (i < item.days.length - 1) {
        isPrevDay = isOneDayEarlier(item.days[i].date, item.days[i + 1].date);
      }
      if (item.days[i].status && isPrevDay) {
        streakCount += 1;
      } else {
        break;
      }
    }

    updatedItem.streakDays = streakCount;

    return updatedItem;
  });
  return newData;
};

export default countStreakDays;
