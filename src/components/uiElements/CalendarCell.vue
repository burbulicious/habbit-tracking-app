<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  day: {
    type: Object,
    required: true
  },
  isFuture: {
    type: Boolean,
    default: false
  },
  today: {
    type: String,
    default: ''
  },
  status: {
    type: Boolean,
    default: false
  }
});

const status = ref(props.status);
const statusMessage = ref('');
const updateStatusMessage = () => {
  if (status.value === true) {
    statusMessage.value = 'V';
  } else if (status.value === false) {
    statusMessage.value = 'X';
  } else {
    statusMessage.value = ' ';
  }
};

updateStatusMessage();

watch(
  () => props.status,
  newValue => {
    status.value = newValue;
    updateStatusMessage();
  }
);
</script>

<template>
  <div
    :class="{
      'bg-grey-900': isFuture,
      'cursor-pointer': !isFuture
    }"
    class="min-w-[72px] flex h-[68px] justify-center items-center border-r border-r-grey-850 flex-grow"
  >
    {{ statusMessage }}
  </div>
</template>
