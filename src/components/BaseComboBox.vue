<template>
  <div class="combo" ref="el">
    <button
      class="combo-input"
      role="combobox"
      aria-haspopup="listbox"
      tabindex="0"
      @click="toggleOpen"
      @mousedown.stop
      @mouseup.stop
      @blur="onBlur"
      @keydown.arrow-up="selectPrev"
      @keydown.arrow-down="selectNext"
      @keydown.enter="updateValue(selectedIndex)"
      @keydown.space="updateValue(selectedIndex)"
      @keydown.home="selectFirst"
      @keydown.page-up="selectFirst"
      @keydown.end="selectLast"
      @keydown.page-down="selectLast"
    >
      {{ displayOption(options[valueIndex]) }}
    </button>
    <div
      v-if="isOpen"
      ref="list"
      class="combo-list"
      role="listbox"
      tabindex="-1"
    >
      <div
        v-for="(option, index) of options"
        :key="option.id"
        class="combo-option"
        role="option"
        :aria-selected="selectedIndex === index"
        @mousedown="updateValue(index)"
        @mouseenter="selectedIndex = index"
      >
        {{ displayOption(option) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch, nextTick } from 'vue'

interface Option {
  id: any
  label?: string
}

type Alignment = 'above' | 'below'

const props = defineProps<{
  options: Option[]
  value: any
  preferredAlignment?: Alignment
  prefix?: string
}>()
const { value, options } = toRefs(props)

const emit = defineEmits<{
  (e: 'update:value', value: any): void
}>()

const el = ref<HTMLDivElement | null>()
const list = ref<HTMLDivElement | null>()
const isOpen = ref(false)
const listPosition = ref(0)
const selectedIndex = ref(0)
const valueIndex = computed(() =>
  options.value.findIndex(({ id }) => id === value.value)
)

watch(value, () => (selectedIndex.value = valueIndex.value))
const onBlur = () => (isOpen.value = false)

const toggleOpen = () => (isOpen.value ? close() : open())
const displayOption = (option: Option) =>
  option ? `${props.prefix} ${option.label ?? option.id}` : 'none'

const open = async () => {
  isOpen.value = true
  // Wait for the list to be rendered.
  await nextTick()

  if (!el.value || !list.value) return
  const { top, bottom } = el.value.getBoundingClientRect()
  const { height } = list.value.getBoundingClientRect()

  const isPreferredAbove = props.preferredAlignment === 'above'
  const above = top - height
  const below = bottom

  let absolutePosition
  if (isPreferredAbove) {
    absolutePosition = above >= 0 ? above : below
  } else {
    absolutePosition = below + height <= window.innerHeight ? below : above
  }

  listPosition.value = absolutePosition - top
}

const close = () => (isOpen.value = false)

const select = (index: number) => {
  const { length } = options.value
  selectedIndex.value = index < 0 ? length - 1 : index >= length ? 0 : index
}

const selectNext = () => select(selectedIndex.value + 1)
const selectPrev = () => select(selectedIndex.value - 1)
const selectFirst = () => select(0)
const selectLast = () => select(options.value.length - 1)

const updateValue = (index: number) =>
  emit('update:value', options.value[index].id)
</script>

<style scoped lang="scss">
@use '@/styles/utilities';

.combo {
  display: flex;
  flex-direction: column; // column-reverse;

  --input-height: 1.5em;
  --option-height: 23px;
  --radius: var(--radius-s);

  &-input {
    display: block;
    padding: 0.16em var(--radius) 0.3em var(--radius);
    text-align: center;
    cursor: pointer;
  }

  &-list {
    @include utilities.glass;
    @include utilities.font-menu;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: v-bind('listPosition + `px`');
    border-radius: var(--radius);

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        180deg,
        var(--glass-color-solid),
        transparent 7em calc(100% - 5em),
        var(--glass-color-solid)
      );
      border-radius: var(--radius);
      z-index: -1;
    }
  }

  &-option {
    height: var(--option-height);
    display: flex;
    align-items: center;
    padding: 0 var(--radius);
    cursor: pointer;

    &:first-child {
      padding-top: 2px;
      border-top-left-radius: var(--radius);
      border-top-right-radius: var(--radius);
    }

    &:last-child {
      padding-bottom: 2px;
      border-bottom-left-radius: var(--radius);
      border-bottom-right-radius: var(--radius);
    }
  }

  &-option[aria-selected='true'] {
    @include utilities.glass-darker;

    &:not(:last-child, :first-child) {
      margin: -1px 0;
      padding-top: 1px;
      padding-bottom: 1px;
    }
  }
}
</style>
