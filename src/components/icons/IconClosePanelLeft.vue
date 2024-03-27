<script setup>
defineProps({
  iconColour: {
    type: String,
    default: 'white'
  }
});
</script>
<template>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L4 12L12 20" :stroke="iconColour" stroke-width="2" />
    <path d="M20 4L12 12L20 20" :stroke="iconColour" stroke-width="2" />
  </svg>
</template>
