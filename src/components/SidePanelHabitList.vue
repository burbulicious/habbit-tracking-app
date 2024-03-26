<script setup>
import { ref, onMounted, computed } from 'vue';
import ButtonComponent from './uiElements/ButtonComponent.vue';
import HabitListItem from './HabitListItem.vue';
import HabitAddEdit from './HabitAddEdit.vue';
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../utils/handleLocalStorage';
import getToday from '../utils/getToday';
import dataKey from '../utils/dataKeys';

const today = ref(null);
const addHabitBtnVisible = ref(true);

const data = ref(
  (getDataFromLocalStorage(dataKey).length !== 0 && getDataFromLocalStorage(dataKey)) || [
    {
      title: 'Example Habit',
      streakDays: 5,
      days: [
        { date: '2024-03-01', status: true },
        { date: '2024-03-02', status: true },
        { date: '2024-03-08', status: true },
        { date: '2024-03-12', status: true },
        { date: getToday(), status: true }
      ]
    }
  ]
);

const emits = defineEmits(['onEdit']);

const reversedDate = computed(() => {
  return [...data.value].reverse();
});

const toggleAddItem = () => {
  addHabitBtnVisible.value = !addHabitBtnVisible.value;
};

const saveNewItem = habit => {
  toggleAddItem();
  data.value.push({ title: habit, streakDays: 0, days: [{ date: today.value, status: false }] });
  storeDataInLocalStorage(dataKey, data.value);
};

const updateHabitStatus = (updatedData, index, value) => {
  let updatedDays = [];
  updatedDays = updatedData[index].days.map(day => {
    if (day.date === today.value) {
      return { ...day, status: value };
    }
    return day;
  });
  return updatedDays;
};

const countStreakDays = updatedData => {
  let newData = [];
  newData = updatedData.map(item => {
    let streakCount = 0;
    const updatedItem = { ...item };
    for (let i = item.days.length - 1; i >= 0; i -= 1) {
      if (item.days[i].date !== today.value) {
        if (item.days[i].status) {
          streakCount += 1;
        } else {
          break;
        }
      } else if (item.days[i].date === today.value && item.days[i].status) {
        streakCount += 1;
      }
    }
    updatedItem.streakDays = streakCount;
    return updatedItem;
  });
  return newData;
};

const handleActiveState = (index, value) => {
  let updatedData = [...data.value];
  updatedData[index].days = updateHabitStatus(updatedData, index, value);
  updatedData = countStreakDays(updatedData);
  data.value = updatedData;
  storeDataInLocalStorage(dataKey, data.value);
};

const updateToday = () => {
  today.value = getToday();
  data.value.forEach(item => {
    const hasTodayEntry = item.days.some(day => day.date === today.value);
    if (!hasTodayEntry) {
      item.days.push({ date: today.value, status: false });
    }
  });
};

const isCompletedToday = habit => {
  const todayDate = getToday();
  return habit.days.some(day => day.date === todayDate && day.status);
};

const deleteItem = ReversedIndex => {
  const dataIndex = data.value.length - 1 - ReversedIndex;
  data.value.splice(dataIndex, 1);
  storeDataInLocalStorage(dataKey, data.value);
};

const editItem = ReversedIndex => {
  const dataIndex = data.value.length - 1 - ReversedIndex;
  emits('onEdit', dataIndex, data.value);
};

onMounted(updateToday);
</script>

<template>
  <div class="bg-grey-900 w-[400px] flex-none h-full px-5 py-8">
    <h1 class="h1 pb-2">Your habits</h1>
    <h2 class="h3 pb-5">{{ today }}</h2>
    <ButtonComponent btn-text="+ Add a new habit" colour="yellow" v-if="addHabitBtnVisible" @click="toggleAddItem" />
    <div class="py-5">
      <HabitAddEdit class="mb-2" v-if="!addHabitBtnVisible" @saveItem="saveNewItem" @cancel="toggleAddItem" />
      <HabitListItem
        v-for="(habit, index) in reversedDate"
        :key="index"
        :isCompleted="isCompletedToday(habit)"
        :isLarge="true"
        :title="habit.title"
        :streakDays="habit.streakDays"
        class="mb-2"
        @updateIsActive="handleActiveState(index, $event)"
        @onDelete="deleteItem(index)"
        @onEdit="editItem(index)"
      />
    </div>
  </div>
</template>
