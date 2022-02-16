<template>
  <div class="input">
    <input
      @mousedown.prevent
      @mouseup="test"
      :value="value"
      type="number"
      v-bind="{ min, max, step }"
    />
    <span class="input-unit">{{ unit }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: number
  unit: string
  min?: number
  max?: number
  step?: number
}>()

const test = () => console.log('jau')
</script>

<style scoped lang="scss">
@use '@/styles/utilities';

.input {
  display: flex;
  border-radius: var(--radius-xs);
  width: 4.5em;
  height: 1.5em;
  padding: 0 0.3em;
  @include utilities.font-menu;
  @include utilities.glass;

  &-unit {
    display: flex;
    align-items: center;
    color: hsl(0deg 0% 85%);
  }

  input {
    flex: 1;
    min-width: 1em;
    cursor: ew-resize;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
