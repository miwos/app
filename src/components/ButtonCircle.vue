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
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
}
</style>
