<template>
  <div class="modules-select" role="listbox">
    <div
      v-for="(module, index) in modules"
      class="modules-select-option pill"
      :class="index === focusedIndex ? 'glass-darker' : 'glass'"
      role="option"
      :key="module.id"
      :aria-selected="props.value === module.id"
      @click="emit('update:value', module.id)"
    >
      <ModuleShape class="modules-select-shape" :id="module.shapeId" />
      <div class="result-name">{{ module.id }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Module } from '@/types/Module'
import { onKeyDown } from '@vueuse/core'
import { ref, watch, watchEffect } from 'vue'
import ModuleShape from './ModuleShape.vue'

const props = defineProps<{
  value?: Module['id']
  modules: Module[]
}>()

const emit = defineEmits<{
  (e: 'update:value', id: Module['id']): void
}>()

const focusedIndex = ref(0)

watch(
  () => props.modules,
  () => (focusedIndex.value = 0)
)

onKeyDown('ArrowUp', (e) => {
  e.preventDefault()
  focus(focusedIndex.value - 1)
})

onKeyDown('ArrowDown', (e) => {
  e.preventDefault()
  focus(focusedIndex.value + 1)
})

onKeyDown('Enter', () =>
  emit('update:value', props.modules[focusedIndex.value].id)
)

const focus = (index: number) => {
  const { modules } = props
  focusedIndex.value =
    index < 0 ? modules.length - 1 : index >= modules.length ? 0 : index
}
</script>

<style scoped lang="scss">
.modules-select {
  &-option {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  &-shape:deep(svg) {
    height: 2.5rem;
    width: 2.5rem;
    padding: 0.5rem;
    box-sizing: border-box;

    .outline {
      display: none;
    }
    .shape {
      fill: var(--module-shape-color-lighter);
    }
  }
}
</style>
