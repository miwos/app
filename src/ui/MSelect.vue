<template>
  <ul
    ref="el"
    class="m-select"
    :class="{ overflow: isOverflowing }"
    role="listbox"
  >
    <li
      v-for="(option, index) in props.options"
      :key="option.id"
      class="m-select-option"
      role="option"
      :aria-selected="props.value === option.id"
      @click="emit('update:value', option.id)"
      @mouseenter="focus(index)"
    >
      <slot
        name="option"
        v-bind="option"
        :isFocused="index === focusedIndex"
      ></slot>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { nextTick, onMounted, onUnmounted, ref, toRefs, watch } from 'vue'

const emit = defineEmits<{ (e: 'update:value', id: any): void }>()

const props = defineProps<{
  value?: any
  options: { id: any }[]
}>()

const el = ref<HTMLElement>()
const { options } = toRefs(props)
const focusedIndex = ref(0)
const bounds = useElementBounding(el, { windowScroll: false })
const isOverflowing = ref(false)

watch(options, async () => {
  focusedIndex.value = 0
  if (el.value) {
    await nextTick()
    isOverflowing.value = el.value.scrollHeight > el.value.clientHeight
  }
})

const focus = (index: number) => {
  const { length } = options.value
  focusedIndex.value = index < 0 ? length - 1 : index >= length ? 0 : index
  scrollOptionIntoView(focusedIndex.value)
}

const scrollOptionIntoView = (index: number) => {
  const option = el.value?.children[index] as HTMLElement
  if (!option) return

  const { top, bottom } = option.getBoundingClientRect()
  if (bottom > bounds.bottom.value) {
    option.scrollIntoView({ block: 'end' })
  } else if (top < bounds.top.value) {
    option.scrollIntoView({ block: 'start' })
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  const { key } = e
  if (key === 'ArrowUp') {
    e.preventDefault()
    focus(focusedIndex.value - 1)
  } else if (key === 'ArrowDown') {
    e.preventDefault()
    focus(focusedIndex.value + 1)
  } else if (key === 'Enter') {
    emit('update:value', options.value[focusedIndex.value].id)
  } else if (key === 'PageUp' || key === 'Home') {
    e.preventDefault()
    focus(0)
  } else if (key === 'PageDown' || key === 'End') {
    e.preventDefault()
    focus(options.value.length - 1)
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<style lang="scss">
.m-select {
  list-style: none;
  padding-left: 0;
  overflow-y: auto;

  &-option {
    cursor: pointer;
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
}
</style>
