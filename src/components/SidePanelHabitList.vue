<script setup>
import { ref, onMounted } from 'vue';
import ButtonComponent from './uiElements/ButtonComponent.vue';
import HabitListItem from './HabitListItem.vue';
import HabitAddEdit from './HabitAddEdit.vue';
import { storeDataInLocalStorage } from '../utils/handleLocalStorage';
import { getToday } from '../utils/timeCalculations';
import isCompletedToday from '../utils/isCompletedToday';
import dataKey from '../utils/dataKeys';

const props = defineProps({
  habitsData: {
    type: Object,
    required: true
  }
});
const today = ref(null);
const addHabitBtnVisible = ref(true);

const data = ref(props.habitsData);

const emits = defineEmits(['onEdit', 'onChange']);

const toggleAddItem = () => {
  addHabitBtnVisible.value = !addHabitBtnVisible.value;
};

const saveNewItem = habit => {
  toggleAddItem();
  data.value.push({ title: habit, streakDays: 0, days: [{ date: today.value, status: false }] });
  storeDataInLocalStorage(dataKey, data.value);
  emits('onChange', data.value);
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
    for (let i = 0; i <= item.days.length - 1; i += 1) {
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
  emits('onChange', data.value);
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

const deleteItem = dataIndex => {
  data.value.splice(dataIndex, 1);
  storeDataInLocalStorage(dataKey, data.value);
  emits('onChange', data.value);
};

const editItem = dataIndex => {
  emits('onEdit', dataIndex, data.value);
  emits('onChange', data.value);
};

onMounted(updateToday);
</script>

<template>
  <div class="bg-grey-900 w-[400px] flex-none h-full px-5 py-8">
    <h1 class="h1 pb-2">Your habits</h1>
    <h2 class="h3 pb-5">{{ today }}</h2>
    <div class="py-5">
      <HabitListItem
        v-for="(habit, index) in data"
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
      <HabitAddEdit class="mb-2" v-if="!addHabitBtnVisible" @saveItem="saveNewItem" @cancel="toggleAddItem" />
    </div>
    <ButtonComponent btn-text="+ Add a new habit" colour="yellow" v-if="addHabitBtnVisible" @click="toggleAddItem" />
  </div>
</template>
