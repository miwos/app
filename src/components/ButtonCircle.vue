<template>
  <button class="button-circle" @click="emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])
</script>

<style scoped>
.button-circle {
  width: var(--size);
  height: var(--size);
  border-radius: calc(var(--size) / 2);
  border: none;
}
</style>
