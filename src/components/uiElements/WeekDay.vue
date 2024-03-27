<script setup>
defineProps({
  day: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  elementHeight: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div
    class="min-w-[72px] flex flex-col justify-center items-center border-r border-r-grey-850 flex-grow"
    :class="elementHeight"
  >
    <h5 class="h5 pb-1" :class="{ 'text-yellow': active }">{{ day.weekday }}</h5>
    <div class="w-8 h-8 flex items-center justify-center rounded-full" :class="{ 'text-black bg-yellow': active }">
      {{ day.day }}
    </div>
  </div>
</template>
