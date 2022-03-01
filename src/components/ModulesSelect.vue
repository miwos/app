<template>
  <div class="modules-select" role="listbox">
    <div
      v-for="(module, index) in modules"
      :key="module.id"
      class="modules-select-option"
      :class="{ focused: index === focusedIndex }"
      role="option"
      :aria-selected="props.value === module.id"
      @click="emit('update:value', module.id)"
    >
      <ShapePath
        class="modules-select-thumb"
        :shape="shapes.get(module.shapeId)"
      />
      <div class="result-name">{{ module.id }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShapes } from '@/store/shapes'
import { Module } from '@/types/Module'
import { onMounted, onUnmounted, ref, toRefs, watch } from 'vue'
import ShapePath from './ShapePath.vue'

const props = defineProps<{
  value?: Module['id']
  modules: Module[]
}>()

const emit = defineEmits<{
  (e: 'update:value', id: Module['id']): void
}>()

const shapes = useShapes()
const focusedIndex = ref(0)
const { modules } = toRefs(props)

watch(modules, () => (focusedIndex.value = 0))

const onKeyDown = (e: KeyboardEvent) => {
  const { key } = e
  if (key === 'ArrowUp') {
    e.preventDefault()
    focus(focusedIndex.value - 1)
  } else if (key === 'ArrowDown') {
    e.preventDefault()
    focus(focusedIndex.value + 1)
  } else if (key === 'Enter') {
    emit('update:value', modules.value[focusedIndex.value].id)
  } else if (key === 'PageUp' || key === 'Home') {
    e.preventDefault()
    focus(0)
  } else if (key === 'PageDown' || key === 'End') {
    e.preventDefault()
    focus(modules.value.length - 1)
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})

const focus = (index: number) => {
  const { modules } = props
  focusedIndex.value =
    index < 0 ? modules.length - 1 : index >= modules.length ? 0 : index
}
</script>

<style scoped lang="scss">
@use '@/styles/utilities';

.modules-select {
  &-option {
    @include utilities.pill;
    @include utilities.glass;
    display: flex;
    align-items: center;
    gap: 0.5em;

    &.focused {
      @include utilities.glass-darker;
    }
  }

  &-thumb {
    height: 2.5rem;
    width: 2.5rem;
    padding: 0.5rem;
    box-sizing: border-box;
    fill: var(--module-shape-color-lighter);
  }
}
</style>
