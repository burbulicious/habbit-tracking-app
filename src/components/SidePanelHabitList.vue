<script setup>
import { ref, onMounted, watch } from 'vue';
import ButtonComponent from './uiElements/ButtonComponent.vue';
import HabitListItem from './HabitListItem.vue';
import HabitAddEdit from './HabitAddEdit.vue';
import { storeDataInLocalStorage } from '../utils/handleLocalStorage';
import { getToday } from '../utils/timeCalculations';
import isCompletedToday from '../utils/isCompletedToday';
import dataKey from '../utils/dataKeys';
import countStreakDays from '../composables/countStreakDays';
import IconClosePanelLeft from './icons/IconClosePanelLeft.vue';

const props = defineProps({
  habitsData: {
    type: Object,
    required: true
  }
});
const today = ref(null);
const addHabitBtnVisible = ref(true);

const data = ref(props.habitsData);
const showSidePanel = ref(true);

const emits = defineEmits(['onEdit', 'onChange']);

const toggleAddItem = () => {
  addHabitBtnVisible.value = !addHabitBtnVisible.value;
};

const saveNewItem = habit => {
  toggleAddItem();
  data.value.push({ title: habit, streakDays: 0, days: [{ date: today.value, status: null }] });
  storeDataInLocalStorage(dataKey, data.value);
  emits('onChange', data.value);
};

const updateHabitStatus = (index, value) => {
  let updatedDays = [];
  updatedDays = data.value[index].days.map(day => {
    if (day.date === today.value) {
      return { ...day, status: value };
    }
    return day;
  });
  data.value[index].days = updatedDays;
};

const handleActiveState = (index, value) => {
  updateHabitStatus(index, value);
  data.value = countStreakDays(data.value);
  storeDataInLocalStorage(dataKey, data.value);
  emits('onChange', data.value);
};

const updateToday = () => {
  today.value = getToday();
  data.value.forEach(item => {
    const hasTodayEntry = item.days.some(day => day.date === today.value);
    if (!hasTodayEntry) {
      item.days.push({ date: today.value, status: null });
    }
  });
};

const deleteItem = dataIndex => {
  data.value.splice(dataIndex, 1);
  storeDataInLocalStorage(dataKey, data.value);
  emits('onChange', data.value);
};

const editItem = dataIndex => {
  storeDataInLocalStorage(dataKey, data.value);
  emits('onChange', data.value);
  emits('onEdit', dataIndex, data.value);
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
  <div
    class="bg-grey-900 flex-non px-5 py-8 fixed md:relative z-10 md:w-fit h-[100vh] overflow-auto flex-none custom-scroll"
    :class="{ 'w-full': showSidePanel }"
  >
    <button class="absolute z-0 top-2 right-2 opacity-50" type="button" @click="showSidePanel = !showSidePanel">
      <IconClosePanelLeft class="transition-all duration-300" :class="{ 'rotate-180': !showSidePanel }" />
    </button>
    <div class="md:w-[400px] max-w-full" v-show="showSidePanel">
      <h1 class="h1 pb-2">Your habits today</h1>
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
      <ButtonComponent
        class="md:hidden mt-4"
        :btn-text="`Show calendar`"
        colour="yellow"
        :isSecondary="true"
        v-if="addHabitBtnVisible"
        @click="showSidePanel = !showSidePanel"
      />
    </div>
  </div>
</template>
<style scoped>
.custom-scroll {
  &::-webkit-scrollbar-track {
    @apply bg-grey-900;
  }

  &::-webkit-scrollbar {
    @apply bg-grey-900 w-3;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-white bg-opacity-70 w-3 rounded-full;
  }
}
</style>
