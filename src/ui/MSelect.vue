<template>
  <ul
    ref="el"
    class="m-select"
    :class="{ overflow: isOverflowing }"
    :data-theme="theme ?? 'default'"
    role="listbox"
    :aria-label="label"
    tabindex="0"
  >
    <li
      v-for="(option, index) in props.options"
      :key="option.id"
      class="m-select-option"
      :class="{ focus: index === focusedIndex }"
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
  options: { id: any; label?: string }[]
  theme?: 'default' | 'none'
  autoFocus?: boolean
  label?: string
}>()

const el = ref<HTMLElement>()
const { options } = toRefs(props)
const focusedIndex = ref(0)
const bounds = useElementBounding(el, { windowScroll: false })
const isOverflowing = ref(false)

onMounted(() => {
  if (props.autoFocus) el.value?.focus()
  if (props.value !== undefined) {
    const index = props.options.findIndex((v) => v.id === props.value)
    focus(index)
  }
})

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
    e.preventDefault()
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
  margin: 0;
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

.m-select[data-theme='default'] {
  --radius: var(--radius-s);
  border-radius: var(--radius);
  white-space: nowrap;
  background-color: var(--m-select-color-bg);

  .m-select-option {
    height: 23px;
    display: flex;
    align-items: center;
    padding: 0 var(--radius);
    cursor: pointer;

    &.focus:not(:last-child, :first-child) {
      margin: -1px 0;
      padding-top: 1px;
      padding-bottom: 1px;
    }

    &.focus {
      background-color: var(--m-select-color-focus);
    }
  }
}

// .m-select {
//   --radius: var(--radius-s);
//   --option-height: 23px;
//   border-radius: var(--radius);
//   white-space: nowrap;
//   outline: none;
//   background-color: red;
// }
// .m-select-option {
//   height: var(--option-height);
//   display: flex;
//   align-items: center;
//   padding: 0 var(--radius);
//   cursor: pointer;
//   &:first-child {
//     padding-top: 2px;
//     border-top-left-radius: var(--radius);
//     border-top-right-radius: var(--radius);
//   }
//   &:last-child {
//     padding-bottom: 2px;
//     border-bottom-left-radius: var(--radius);
//     border-bottom-right-radius: var(--radius);
//   }
// }
</style>
