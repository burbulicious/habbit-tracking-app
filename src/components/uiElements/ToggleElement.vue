<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isActive: {
    type: Boolean,
    default: true
  }
});
const emits = defineEmits(['updateIsActive']);

const isActive = ref(props.isActive);

const toggleState = () => {
  isActive.value = !isActive.value;
  emits('updateIsActive', isActive.value);
};

watch(
  () => props.isActive,
  newValue => {
    isActive.value = newValue;
  }
);
</script>
<template>
  <button class="toggle-button" :class="{ active: isActive }" @click="toggleState" type="button"></button>
</template>
<style scoped>
.toggle-button {
  @apply w-8 h-[18px] rounded-full bg-white cursor-pointer border-none relative;
}

.toggle-button.active {
  @apply bg-green;
}

.toggle-button::before {
  @apply content-[''] block rounded-full w-[14px] h-[14px] bg-green relative top-0 left-[2px] transition-transform duration-300;
}

.toggle-button.active::before {
  @apply translate-x-[14px] bg-white;
}
</style>
