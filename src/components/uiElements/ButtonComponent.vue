<script setup>
const props = defineProps({
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
  },
  outlined: {
    type: Boolean,
    default: true
  }
});

let btnClasses;
if (props.outlined) {
  btnClasses = `btn btn__${props.colour}${props.isSecondary ? '__outlined' : ''}`;
} else {
  btnClasses = `btn-inline btn-inline__${props.colour} text-base`;
}
</script>
<template>
  <button type="button" :class="btnClasses">{{ btnText }}</button>
</template>
