<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Weekday from '../components/uiElements/WeekDay.vue';
import CalendarCell from '../components/uiElements/CalendarCell.vue';
import { isFuture, getCurrentWeekDays } from '../utils/timeCalculations';

const props = defineProps({
  data: {
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
  },
  selectedDateProp: {
    type: String,
    default: ''
  }
});

const emits = defineEmits(['onPathChange']);

const route = useRoute();
const visibleWeekDays = ref([]);
const dataRef = ref(props.data);
const selectedDate = ref(route.params.selectedDate);

visibleWeekDays.value = getCurrentWeekDays(selectedDate.value);

const getDayStatus = (date, index) => {
  const habitData = dataRef.value[index];
  const currentDay = habitData.days.find(day => day.date === date);
  if (currentDay) {
    return currentDay.status;
  }

  return null;
};

watch(
  () => visibleWeekDays.value,
  newValue => {
    visibleWeekDays.value = newValue;
  }
);

watch(
  () => props.data,
  newValue => {
    dataRef.value = newValue;
  }
);

watch(
  () => route.params.selectedDate,
  newValue => {
    selectedDate.value = newValue;
    visibleWeekDays.value = getCurrentWeekDays(selectedDate.value);
    emits('onPathChange', selectedDate.value);
  }
);

onMounted(() => {
  emits('onPathChange', selectedDate.value);
});
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
        :selected="day.fullFormat === selectedDate"
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
