<template>
  <div
    class="modules-select"
    role="listbox"
    ref="el"
    :class="{ overflow: isOverflown }"
  >
    <div
      v-for="(module, index) in modules"
      :key="module.id"
      class="modules-select-option"
      :class="{ focused: index === focusedIndex }"
      role="option"
      :aria-selected="props.value === module.id"
      @click="emit('update:value', module.id)"
      @mouseenter="focus(index)"
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
import { useShapes } from '@/stores/shapes'
import { Module } from '@/types/Module'
import { nextTick, onMounted, onUnmounted, ref, toRefs, watch } from 'vue'
import ShapePath from './ShapePath.vue'

const props = defineProps<{
  value?: Module['id']
  modules: Module[]
}>()

const emit = defineEmits<{
  (e: 'update:value', id: Module['id']): void
}>()

const shapes = useShapes()
const el = ref<HTMLElement | null>(null)
const focusedIndex = ref(0)
const isOverflown = ref(false)
const { modules } = toRefs(props)

let bounds: DOMRect | undefined

watch(modules, async () => {
  focusedIndex.value = 0
  if (el.value) {
    await nextTick()
    bounds = el.value?.getBoundingClientRect()
    isOverflown.value = el.value.scrollHeight > el.value.clientHeight
  }
})

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

  scrollOptionIntoView(focusedIndex.value)
}

const scrollOptionIntoView = (index: number) => {
  const optionEl = el.value?.children[index] as HTMLElement
  if (!optionEl || !bounds) return

  const { top, bottom } = optionEl?.getBoundingClientRect()
  if (bottom > bounds.bottom) {
    optionEl.scrollIntoView({ block: 'end' })
  } else if (top < bounds.top) {
    optionEl.scrollIntoView({ block: 'start' })
  }
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
    cursor: pointer;

    &.focused {
      @include utilities.glass-darker;
    }
  }

  &.overflow {
    padding-right: 7px;
    margin-right: -15px;
  }

  &-thumb {
    height: 2.5rem;
    width: 2.5rem;
    padding: 0.5rem;
    box-sizing: border-box;
    fill: var(--module-shape-color-lighter);
  }
}

::-webkit-scrollbar {
  width: 8px;
  background: var(--glass-color-solid);
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  -webkit-border-radius: 10px;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: var(--glass-color-darker-solid);
}
</style>
