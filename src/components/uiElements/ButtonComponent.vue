<script setup>
defineProps({
  btnText: {
    type: String,
    default: 'Button text'
  },
  colour: {
    type: String,
    // the colour name is the class name from buttons.scss
    default: 'yellow'
  },
  isSecondary: {
    type: Boolean,
    default: false
  }
});
</script>
<template>
  <button type="button" class="btn" :class="`btn__${colour}${isSecondary ? '__outlined' : ''}`">{{ btnText }}</button>
</template>
