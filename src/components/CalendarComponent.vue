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
import countStreakDays from '../composables/countStreakDays';

const props = defineProps({
  habitsData: {
    type: Object,
    required: true
  }
});

const emits = defineEmits(['onChange']);

const habitListItemWidth = 'w-[200px] sm:w-[300px] md:w-[400px] ';
const habitListItemHeight = 'h-[100px] md:h-[68px] ';
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

const handelStatusChange = (value, day, index) => {
  let updatedDays = [];
  if (data.value[index].days.some(dayEntry => dayEntry.date === day)) {
    updatedDays = data.value[index].days.map(dayEntry => {
      if (dayEntry.date === day) {
        return { ...dayEntry, status: value };
      }
      return dayEntry;
    });
  } else {
    updatedDays = data.value[index].days.map(dayEntry => dayEntry);
    updatedDays.push({ date: day, status: value });
  }
  updatedDays.sort((a, b) => new Date(a.date) - new Date(b.date));
  data.value[index].days = updatedDays;
  data.value = countStreakDays(data.value);
  storeDataInLocalStorage(dataKey, data.value);
  emits('onChange', data.value);
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
  <div class="pl-10 md:pl-0 flex-grow h-full max-h-full max-w-full overflow-x-auto custom-scroll">
    <div class="px-6 py-4 flex md:justify-center items-center border-b border-grey-850 w-full">
      <h2 class="h2">{{ calendarTitle }}</h2>
    </div>

    <div class="relative overflow-x-auto custom-scroll">
      <div class="flex flex-row min-w-[800px] relative">
        <div :class="habitListItemWidth" class="top-0 left-0 md:relative sticky bg-black">
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
          @onStatusChange="handelStatusChange"
        />
      </div>
    </div>

    <div class="border-b border-grey-850 w-full" v-if="!addHabitBtnVisible">
      <HabitAddEdit :isLarge="false" @saveItem="saveNewItem" @cancel="toggleAddItem" :class="habitListItemWidth" />
    </div>
    <div class="border-b border-grey-850 p-3 w-full" v-if="addHabitBtnVisible">
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
<style scoped>
.custom-scroll {
  &::-webkit-scrollbar-track {
    @apply bg-black;
  }

  &::-webkit-scrollbar {
    @apply bg-black w-3;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-white bg-opacity-70 w-3 rounded-full;
  }
}
</style>
