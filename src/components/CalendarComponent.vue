<script setup>
import { ref, onMounted, watch } from 'vue';
import { RouterView } from 'vue-router';
import { getToday, getPrevWeekDate, getNextWeekDate, getDay } from '../utils/timeCalculations';
import IconArrowLeft from './icons/IconArrowLeft.vue';
import HabitListItem from './HabitListItem.vue';
import isCompletedToday from '../utils/isCompletedToday';
import ButtonComponent from './uiElements/ButtonComponent.vue';
import HabitAddEdit from './HabitAddEdit.vue';
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
const addHabitBtnVisible = ref(true);
const selectedDate = ref('');

const updateToday = () => {
  todayLong.value = getToday(false);
  calendarTitle.value = `${todayLong.value.month} ${todayLong.value.year}`;
  todayShort.value = getToday();
};

const toggleAddItem = () => {
  addHabitBtnVisible.value = !addHabitBtnVisible.value;
};

const saveNewItem = habit => {
  toggleAddItem();
  data.value.push({ title: habit, streakDays: 0, days: [{ date: todayShort.value, status: null }] });
  storeDataInLocalStorage(dataKey, data.value);
  emits('onChange', data.value);
};

const handleSelectedItem = value => {
  selectedDate.value = value;
  const { month, year } = getDay(selectedDate.value, false);
  calendarTitle.value = `${month} ${year}`;
};

const prevWeek = () => {
  selectedDate.value = getPrevWeekDate(selectedDate.value);
};

const nextWeek = () => {
  selectedDate.value = getNextWeekDate(selectedDate.value);
};

watch(
  () => props.habitsData,
  newValue => {
    data.value = newValue;
  }
);
watch(
  () => selectedDate.value,
  newValue => {
    selectedDate.value = newValue;
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
            <RouterLink :to="todayShort">
              <ButtonComponent btn-text="Today" colour="white" :isSecondary="true" />
            </RouterLink>
            <div class="flex flex-row items-center">
              <RouterLink :to="selectedDate" class="px-2">
                <IconArrowLeft :iconColour="'white'" @click="prevWeek" />
              </RouterLink>
              <RouterLink :to="selectedDate" class="px-2">
                <IconArrowLeft :iconColour="'white'" :rotation="'right'" @click="nextWeek" />
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

      <RouterView
        :data="data"
        :habitListItemHeight="habitListItemHeight"
        :todayShort="todayShort"
        :selectedDateProp="selectedDate"
        @onPathChange="handleSelectedItem"
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
