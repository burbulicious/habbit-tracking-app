<script setup>
import { ref, onMounted, watch } from 'vue';
import { getToday, getThisWeek, getPrevWeek, getNextWeek, getDay } from '../utils/timeCalculations';
import DaysListView from './WeekView.vue';
import IconArrowLeft from '../components/icons/IconArrowLeft.vue';
import HabitListItem from '../components/HabitListItem.vue';
import isCompletedToday from '../utils/isCompletedToday';
import ButtonComponent from '../components/uiElements/ButtonComponent.vue';
import HabitAddEdit from '../components/HabitAddEdit.vue';
import dataKey from '../utils/dataKeys';
import { storeDataInLocalStorage } from '../utils/handleLocalStorage';

const props = defineProps({
  habitsData: {
    type: Object,
    required: true
  }
});

const emits = defineEmits(['onChange']);

const habitListItemWidth = 'min-w-[400px] w-[400px] ';
const habitListItemHeight = 'h-[68px] ';
const data = ref(props.habitsData);
const todayLong = ref('');
const todayShort = ref('');
const calendarTitle = ref('');
const currentWeekDaysIndex = ref(0);
const visibleWeekDays = ref([]);
const selectedDate = ref(new Date());
const addHabitBtnVisible = ref(true);

const getCurrentWeekDaysIndex = () => {
  return visibleWeekDays.value.findIndex(item => item.fullFormat === selectedDate.value);
};

const updateSelectedDate = () => {
  const { month, year } = getDay(visibleWeekDays.value[currentWeekDaysIndex.value].fullFormat, false);
  calendarTitle.value = `${month} ${year}`;
  selectedDate.value = getDay(visibleWeekDays.value[currentWeekDaysIndex.value].fullFormat);
};

const updateToday = () => {
  const useShortDate = false;
  todayLong.value = getToday(useShortDate);
  calendarTitle.value = `${todayLong.value.month} ${todayLong.value.year}`;
  todayShort.value = getToday();
  selectedDate.value = todayShort.value;
  visibleWeekDays.value = getThisWeek();
  currentWeekDaysIndex.value = getCurrentWeekDaysIndex();
};

const nextWeek = () => {
  visibleWeekDays.value = getNextWeek(selectedDate.value);
  updateSelectedDate();
};

const prevWeek = () => {
  visibleWeekDays.value = getPrevWeek(selectedDate.value);
  updateSelectedDate();
};

const jumptToToday = () => {
  visibleWeekDays.value = getThisWeek();
  updateSelectedDate();
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

onMounted(() => {
  updateToday();
});
</script>

<template>
  <div class="min-w-[800px] flex-grow h-full">
    <div class="w-full px-6 py-4 flex justify-center items-center border-b border-grey-850">
      <h2 class="h2">{{ calendarTitle }}</h2>
    </div>

    <div class="flex flex-row">
      <div :class="habitListItemWidth">
        <div class="border-r border-b border-grey-850">
          <div class="flex flex-row justify-between px-5 py-3 items-center" :class="habitListItemHeight">
            <RouterLink :to="`week/${todayShort}`">
              <ButtonComponent btn-text="Today" colour="white" :isSecondary="true" @click="jumptToToday" />
            </RouterLink>
            <div class="flex flex-row items-center">
              <RouterLink :to="selectedDate" class="px-2">
                <button type="button" @click="prevWeek"><IconArrowLeft :iconColour="'white'" /></button>
              </RouterLink>
              <RouterLink :to="selectedDate" class="px-2">
                <button type="button" @click="nextWeek">
                  <IconArrowLeft :iconColour="'white'" :rotation="'right'" />
                </button>
              </RouterLink>
            </div>
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
            class="w-full"
            :class="habitListItemHeight"
          />
        </div>
      </div>
      <DaysListView
        :data="data"
        :visibleWeekDays="visibleWeekDays"
        :habitListItemHeight="habitListItemHeight"
        :todayShort="todayShort"
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
