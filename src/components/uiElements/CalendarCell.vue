<script setup>
import { ref, watch } from 'vue';
import IconCheckmark from '../icons/IconCheckmark.vue';
import IconClose from '../icons/IconClose.vue';
import tailwind from '../../../tailwind.config';

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
  },
  elementHeight: {
    type: String,
    default: ''
  }
});

const green = tailwind.theme.extend.colors.green.DEFAULT;
const red = tailwind.theme.extend.colors.red.DEFAULT;
const status = ref(props.status);
const statusMessage = ref('');
const updateStatusMessage = () => {
  if (status.value === null) {
    statusMessage.value = ' ';
  } else if (status.value === true) {
    statusMessage.value = 'V';
  } else {
    statusMessage.value = 'X';
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
    :class="[
      {
        'bg-grey-900': isFuture,
        'cursor-pointer': !isFuture,
        'bg-grey-850 bg-opacity-70': status === null && today === day.fullFormat
      },
      elementHeight
    ]"
    class="min-w-[72px] flex justify-center items-center border-r border-r-grey-850 flex-grow"
  >
    <div class="w-6 h-6 flex items-center justify-center">
      <div v-if="!(status === null && today === day.fullFormat) && !isFuture">
        <IconCheckmark :iconColour="green" v-if="status" />
        <IconClose :iconColour="red" v-if="status === false" />
      </div>
    </div>
  </div>
</template>
