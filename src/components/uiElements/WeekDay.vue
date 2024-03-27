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
  },
  selected: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div
    class="min-w-[72px] flex flex-col justify-center items-center border-r border-r-grey-850 flex-grow"
    :class="elementHeight"
  >
    <h5 class="h5 pb-1" :class="{ 'text-yellow': active || selected }">{{ day.weekday }}</h5>
    <div
      class="w-8 h-8 flex items-center justify-center rounded-full border border-black"
      :class="{
        'text-black bg-yellow border-yellow': (active && selected) || active,
        'border-yellow text-yellow': selected && !active
      }"
    >
      {{ day.day }}
    </div>
  </div>
</template>
