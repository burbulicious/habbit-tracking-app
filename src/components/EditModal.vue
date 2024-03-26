<script setup>
import HabitAddEdit from './HabitAddEdit.vue';

defineProps({
  itemData: {
    type: Object,
    required: true
  }
});
const emits = defineEmits(['closeModal', 'saveItem']);

const closeModal = () => {
  emits('closeModal');
};

const save = value => {
  emits('saveItem', value);
};
</script>

<template>
  <div
    class="w-full h-[100vh] fixed top-0 left-0 z-10 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
  >
    <div class="w-[500px] bg-grey-900 rounded-lg p-8">
      <HabitAddEdit
        :saveBtnTitle="'Save changes'"
        :prefilledText="itemData.title"
        @cancel="closeModal"
        @saveItem="save"
      />
    </div>
  </div>
</template>
