<template>
  <button class="button-input" @click="updateValue">
    {{ name }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  toggle: boolean
  value: number
}>()

const emit = defineEmits<{
  (e: 'update:value', value: number): void
}>()

const updateValue = () =>
  emit('update:value', +(props.toggle ? !props.value : true))
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

  &:hover:not(:active) {
    background-color: rgb(255 255 255 / 75%);
  }
}
</style>
