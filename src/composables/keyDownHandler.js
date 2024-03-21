import { onMounted, onUnmounted } from 'vue';

export default function handleKeyDown(cancelFunction, targetKey) {
  const onKeyDown = event => {
    if (event.key === targetKey) {
      cancelFunction();
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown);
  });
}
