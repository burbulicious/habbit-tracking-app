<script setup>
import IconFire from '../icons/IconFire.vue';
import tailwind from '../../../tailwind.config';

defineProps({
  isLarge: {
    type: Boolean,
    default: true
  },
  streakDays: {
    type: Number,
    default: 0
  }
});

const greenLight = tailwind.theme.extend.colors.green.light;
</script>
<template>
  <div class="flex flex-row items-center rounded bg-green py-1 px-2">
    <IconFire :iconColour="greenLight" class="w-3 h-3" />
    <h5 class="h5 text-green-light pl-1">
      <span class="font-bold">{{ streakDays }}</span>
      <span v-if="isLarge">{{ streakDays === 1 ? ' day' : ' days' }} streak</span>
    </h5>
  </div>
</template>
