<script setup>
import { ref, onMounted, watch } from 'vue';
import { getToday, getThisWeek, getPrevWeek, getNextWeek, isFuture } from '../utils/timeCalculations';
import Weekday from './uiElements/WeekDay.vue';
import IconArrowLeft from './icons/IconArrowLeft.vue';
import HabitListItem from './HabitListItem.vue';
import isCompletedToday from '../utils/isCompletedToday';
import ButtonComponent from './uiElements/ButtonComponent.vue';
import HabitAddEdit from './HabitAddEdit.vue';
import dataKey from '../utils/dataKeys';
import { storeDataInLocalStorage } from '../utils/handleLocalStorage';
import CalendarCell from './uiElements/CalendarCell.vue';

const props = defineProps({
  habitsData: {
    type: Object,
    required: true
  }
});

const emits = defineEmits(['onChange']);

const habitListItemWidth = 'min-w-[400px] w-[400px] ';
const data = ref(props.habitsData);
const todayLong = ref('');
const todayShort = ref('');
const todayTitle = ref('');
const visibleWeekDays = ref([]);
const baseDay = ref(new Date());
const addHabitBtnVisible = ref(true);

const updateBaseDay = () => {
  baseDay.value = new Date(visibleWeekDays.value[0].fullFormat);
};

const getDayStatus = (date, index) => {
  const habitData = data.value[index];
  const currentDay = habitData.days.find(day => day.date === date);
  if (currentDay) {
    return currentDay.status;
  }

  return null;
};

const updateToday = () => {
  const useShortDate = false;
  todayLong.value = getToday(useShortDate);
  todayTitle.value = todayLong.value.formattedDate;
  todayShort.value = getToday();
  visibleWeekDays.value = getThisWeek();

  updateBaseDay();
};

const nextWeek = () => {
  visibleWeekDays.value = getNextWeek(baseDay.value);
  updateBaseDay();
};

const prevWeek = () => {
  visibleWeekDays.value = getPrevWeek(baseDay.value);
  updateBaseDay();
};

const jumptToToday = () => {
  visibleWeekDays.value = getThisWeek();
  updateBaseDay();
};

const toggleAddItem = () => {
  addHabitBtnVisible.value = !addHabitBtnVisible.value;
};

const saveNewItem = habit => {
  toggleAddItem();
  data.value.push({ title: habit, streakDays: 0, days: [{ date: todayShort.value, status: false }] });
  storeDataInLocalStorage(dataKey, data.value);
  emits('onChange', data.value);
};

watch(
  () => props.habitsData,
  newValue => {
    data.value = newValue;
  }
);

onMounted(updateToday);
</script>

<template>
  <div class="min-w-[800px] flex-grow h-full">
    <div>
      <div class="w-full px-6 py-4 flex justify-center items-center">
        <h2 class="h2">Today is {{ todayTitle }}</h2>
      </div>
      <div class="flex flex-row items-stretch border-t border-b border-grey-850">
        <div
          :class="habitListItemWidth"
          class="border-r border-r-grey-850 flex flex-row justify-between px-5 py-3 items-center"
        >
          <ButtonComponent btn-text="Today" colour="white" :isSecondary="true" @click="jumptToToday" />
          <div class="flex flex-row items-center">
            <button type="button" @click="prevWeek" class="px-2"><IconArrowLeft :iconColour="'white'" /></button>
            <button type="button" @click="nextWeek" class="px-2">
              <IconArrowLeft :iconColour="'white'" :rotation="'right'" />
            </button>
          </div>
        </div>
        <Weekday
          v-for="(day, index) in visibleWeekDays"
          :key="index"
          :day="day"
          :active="day.fullFormat === todayShort"
        />
      </div>
    </div>
    <div
      v-for="(habit, habitIndex) in data"
      :key="habitIndex"
      class="border-b border-grey-850 flex flex-row items-stretch"
    >
      <HabitListItem
        :isLarge="false"
        :title="habit.title"
        :streakDays="habit.streakDays"
        :isCompleted="isCompletedToday(habit)"
        :class="habitListItemWidth"
      />
      <CalendarCell
        v-for="(day, dayIndex) in visibleWeekDays"
        :key="dayIndex"
        :day="day"
        :isFuture="isFuture(day.fullFormat)"
        :today="todayShort"
        :status="getDayStatus(day.fullFormat, habitIndex)"
      />
    </div>
    <div class="border-b border-grey-850" v-if="!addHabitBtnVisible">
      <HabitAddEdit :isLarge="false" @saveItem="saveNewItem" @cancel="toggleAddItem" :class="habitListItemWidth" />
    </div>
    <div class="border-b border-grey-850 p-3" v-if="addHabitBtnVisible">
      <ButtonComponent
        btn-text="+ Add a new habit"
        colour="yellow"
        :isSecondary="true"
        :outlined="false"
        @click="toggleAddItem"
      />
    </div>
  </div>
</template>
