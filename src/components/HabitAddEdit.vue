<script setup>
import { ref, onMounted } from 'vue';
import IconClose from './icons/IconClose.vue';
import handleKeyDown from '../composables/keyDownHandler';

const props = defineProps({
  isLarge: {
    type: Boolean,
    default: true
  },
  saveBtnTitle: {
    type: String,
    default: 'Add'
  },
  prefilledText: {
    type: String,
    default: ''
  }
});

const inputField = ref(null);

const habitTitle = ref(props.prefilledText);

const emits = defineEmits(['saveItem', 'cancel']);

const saveItem = () => {
  emits('saveItem', habitTitle);
};

const cancel = () => {
  emits('cancel');
};

handleKeyDown(cancel, 'Escape');
handleKeyDown(saveItem, 'Enter');

onMounted(() => {
  inputField.value.focus();
});
</script>

<template>
  <div
    class="flex flex-col items-start relative"
    :class="{ 'large-new-habit-card': isLarge, 'small-new-habit-card': !isLarge }"
  >
    <button type="button" @click="cancel">
      <IconClose iconColour="white" class="w-4 h-4 top-2 right-2 absolute" />
    </button>
    <label class="w-full mb-3">
      <input
        :class="{ large: isLarge }"
        type="text"
        ref="inputField"
        v-model="habitTitle"
        placeholder="Your new habit"
      />
    </label>
    <button :disabled="!habitTitle" type="button" class="text-[14px] uppercase text-yellow" @click="saveItem">
      {{ saveBtnTitle }}
    </button>
  </div>
</template>

<style scoped>
.large-new-habit-card {
  @apply px-3 py-4 rounded bg-grey-900 transition-all duration-300;

  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='white' stroke-width='1' stroke-dasharray='6%2c6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
}

.small-new-habit-card {
  @apply px-3 py-4 border-r-grey-850 border-r h-auto flex items-start;
}

input[type='text'] {
  @apply bg-transparent text-white outline-none w-full;

  &.large {
    @apply text-base leading-tight font-semibold tracking-widest;
  }
}

button {
  @apply transition-all duration-300;

  &:disabled {
    @apply opacity-50;
  }
}
</style>
