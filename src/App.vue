<script setup>
// import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue';
import SidePanelHabitList from './components/SidePanelHabitList.vue';
import EditModal from './components/EditModal.vue';
import { storeDataInLocalStorage } from './utils/handleLocalStorage';
import dataKey from './utils/dataKeys';

const data = ref([]);
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
</script>

<template>
  <div class="w-full h-[100vh] flex flex-row items-stretch text-white">
    <SidePanelHabitList @onEdit="editItem" />
    <div class="min-w-[800px] flex-grow h-full"></div>
    <!-- <div class="bg-grey-900 min-w-[236px] flex-none h-full"></div> -->
  </div>
  <EditModal v-if="showEditModal" :itemData="data[editIndex]" @closeModal="toggleModal" @saveItem="saveItem" />
</template>
