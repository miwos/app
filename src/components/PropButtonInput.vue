<template>
  <button class="button-input">{{ name }}</button>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
</script>

<style scoped lang="scss">
.button-input {
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgb(255 255 255 / 50%);
  color: var(--glass-color-darker-solid);

  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: rgb(255 255 255 / 75%);
  }
}
</style>
