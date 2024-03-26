<script setup>
import { ref } from 'vue';
import SidePanelHabitList from './components/SidePanelHabitList.vue';
import EditModal from './components/EditModal.vue';
import dataKey from './utils/dataKeys';
import CalendarComponent from './components/CalendarComponent.vue';
import { getDataFromLocalStorage, storeDataInLocalStorage } from './utils/handleLocalStorage';
import { getToday } from './utils/timeCalculations';

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

const showEditModal = ref(false);
const editIndex = ref(null);

const toggleModal = () => {
  showEditModal.value = !showEditModal.value;
};

const editItem = (index, value) => {
  data.value = value;
  editIndex.value = index;
  toggleModal();
};

const saveItem = value => {
  toggleModal();
  data.value[editIndex.value].title = value;
  storeDataInLocalStorage(dataKey, data.value);
};

const handleDataChange = value => {
  data.value = value;
};
</script>

<template>
  <div class="w-full h-[100vh] flex flex-row items-stretch text-white">
    <SidePanelHabitList @onEdit="editItem" :habitsData="data" @onChange="handleDataChange" />
    <CalendarComponent :habitsData="data" />
    <!-- <div class="bg-grey-900 min-w-[236px] flex-none h-full"></div> -->
  </div>
  <EditModal v-if="showEditModal" :itemData="data[editIndex]" @closeModal="toggleModal" @saveItem="saveItem" />
</template>
