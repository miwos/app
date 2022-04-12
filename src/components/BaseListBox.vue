<template>
  <div
    ref="el"
    class="list-box"
    role="listbox"
    tabindex="0"
    @keydown.arrow-up="selectPrev"
    @keydown.arrow-down="selectNext"
    @keydown.enter="updateValue(selectedIndex)"
    @keydown.space="updateValue(selectedIndex)"
    @keydown.home="selectFirst"
    @keydown.page-up="selectFirst"
    @keydown.end="selectLast"
    @keydown.page-down="selectLast"
    @blur="emit('blur')"
  >
    <div
      v-for="(option, index) of options"
      :key="option.id"
      class="list-option"
      role="option"
      :aria-selected="selectedIndex === index"
      @mouseenter="selectedIndex = index"
      @mousedown="updateValue(index)"
    >
      {{ displayOption(option) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watch } from 'vue'

const el = ref<HTMLElement | null>(null)

onMounted(() => {
  el.value?.focus()
})

interface Option {
  id: any
  label?: string
}

const props = defineProps<{
  options: Option[]
  value: any
}>()
const { value, options } = toRefs(props)

const emit = defineEmits<{
  (e: 'update:value', value: any): void
  (e: 'blur'): void
}>()

const selectedIndex = ref(0)
const valueIndex = computed(() =>
  options.value.findIndex(({ id }) => id === value.value)
)

watch(value, () => (selectedIndex.value = valueIndex.value))
const displayOption = (option: Option) => option && (option.label ?? option.id)

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

.list-box {
  @include utilities.glass;
  @include utilities.font-menu;
  --radius: var(--radius-s);
  --option-height: 23px;

  border-radius: var(--radius);

  white-space: nowrap;
  outline: none;
}

.list-option {
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

.list-option[aria-selected='true'] {
  background-color: var(--selected-color);

  &:not(:last-child, :first-child) {
    margin: -1px 0;
    padding-top: 1px;
    padding-bottom: 1px;
  }
}
</style>
