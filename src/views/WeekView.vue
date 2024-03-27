<script setup>
import Weekday from '../components/uiElements/WeekDay.vue';
import CalendarCell from '../components/uiElements/CalendarCell.vue';
import { isFuture } from '../utils/timeCalculations';

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  visibleWeekDays: {
    type: Object,
    required: true
  },
  habitListItemHeight: {
    type: String,
    default: ''
  },
  todayShort: {
    type: String,
    default: ''
  }
});

const getDayStatus = (date, index) => {
  const habitData = props.data[index];
  const currentDay = habitData.days.find(day => day.date === date);
  if (currentDay) {
    return currentDay.status;
  }

  return null;
};
</script>

<template>
  <div class="flex-grow">
    <div class="flex flex-row items-stretch border-b border-grey-850">
      <Weekday
        v-for="(day, index) in visibleWeekDays"
        :key="index"
        :day="day"
        :active="day.fullFormat === todayShort"
        :elementHeight="habitListItemHeight"
      />
    </div>
    <div
      v-for="(habit, habitIndex) in data"
      :key="habitIndex"
      class="border-b border-grey-850 flex flex-row items-stretch"
    >
      <CalendarCell
        v-for="(day, dayIndex) in visibleWeekDays"
        :key="dayIndex"
        :day="day"
        :isFuture="isFuture(day.fullFormat)"
        :today="todayShort"
        :status="getDayStatus(day.fullFormat, habitIndex)"
        :elementHeight="habitListItemHeight"
      />
    </div>
  </div>
</template>
