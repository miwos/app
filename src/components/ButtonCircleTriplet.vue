<template>
  <div class="button-circle-triplet">
    <ButtonCircle
      v-for="(_, index) in 3"
      class="button"
      :aria-selected="isSelected(index)"
      @click="select(index)"
    />
  </div>
</template>

<script setup lang="ts">
import ButtonCircle from './ButtonCircle.vue'

const props = defineProps<{
  value: number
}>()
const emit = defineEmits(['update:value'])

const isSelected = (index: number) => index === props.value
const select = (index: number) => emit('update:value', index)
</script>

<style scoped lang="scss">
.button-circle-triplet {
  display: flex;

  &:hover .button:not([aria-selected='true']) {
    background-color: rgb(77, 77, 77);
  }

  &:not(:hover) .button {
    transition: background-color 0.5s;
  }
}

.button {
  background-color: transparent;
  --size: 2.5rem;
}

.button[aria-selected='true'] {
  background-color: var(--color);
}
</style>
