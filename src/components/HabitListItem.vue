<script setup>
import { ref, watch } from 'vue';
import Toggle from './uiElements/ToggleElement.vue';
import StreakLabel from './uiElements/StreakLabel.vue';

const props = defineProps({
  isCompleted: {
    type: Boolean,
    default: true
  },
  isLarge: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'Your habit'
  },
  streakDays: {
    type: Number,
    default: 0
  }
});
const emits = defineEmits(['updateIsActive', 'onDelete', 'onEdit']);

const isActive = ref(props.isCompleted);
const streakDaysCount = ref(props.streakDays);

const handleToggleUpdate = value => {
  isActive.value = value;
  emits('updateIsActive', isActive.value);
};

const handleDelete = () => {
  emits('onDelete');
};

const handleEdit = () => {
  emits('onEdit');
};

watch(
  () => props.isCompleted,
  newValue => {
    isActive.value = newValue;
  }
);

watch(
  () => props.streakDays,
  newValue => {
    streakDaysCount.value = newValue;
  }
);
</script>

<template>
  <div :class="{ 'large-habit-card': isLarge, 'small-habit-card': !isLarge, active: isActive }">
    <div class="flex flex-col md:flex-row md:items-center w-full md:h-6" :class="{ 'md:mb-2': isLarge }">
      <h4 class="md:pr-3 flex-grow md:mb-0 md:order-1 order-2" :class="{ 'h4 mb-4': isLarge }">{{ title }}</h4>
      <StreakLabel
        :isLarge="isLarge"
        :streakDays="streakDaysCount"
        v-if="streakDaysCount > 0"
        class="w-fit md:order-2 order-1 md:mb-0 mb-2"
      />
    </div>
    <div v-if="isLarge" class="flex flex-col md:flex-row md:items-center">
      <div class="flex flex-row items-center flex-grow md:pr-3 md:pb-0 pb-3">
        <Toggle :isActive="isActive" @updateIsActive="handleToggleUpdate"></Toggle>
        <h5 class="h5 text-white text-opacity-70 pl-2">
          {{ isActive ? 'Completed today' : 'Mark as completed today' }}
        </h5>
      </div>
      <div class="flex flex-row items-center text-yellow action-btns">
        <button type="button" class="mr-3 text-[14px] uppercase" @click="handleEdit">Edit</button>
        <button type="button" class="text-[14px] uppercase" @click="handleDelete">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.large-habit-card {
  @apply px-3 py-4 rounded bg-grey-900 border-grey-800 border transition-all duration-300;

  h4 {
    @apply text-white;
  }

  .action-btns {
    @apply md:opacity-0 transition-all duration-300;
  }

  &:hover {
    .action-btns {
      @apply opacity-100;
    }
  }

  &.active {
    @apply bg-grey-850 border-grey-850;
  }
}

.small-habit-card {
  @apply px-3 py-[10px] border-r-grey-850 border-r  flex items-center m-0 text-white;

  h4 {
    @apply text-white;
  }

  &.active {
    h4 {
      @apply text-green;
    }
  }
}
</style>
