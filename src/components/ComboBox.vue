<template>
  <div class="combo">
    <button
      class="combo-input"
      role="combobox"
      aria-haspopup="listbox"
      tabindex="0"
      @click="toggleOpen"
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
    <div v-if="isOpen" class="combo-list glass" role="listbox" tabindex="-1">
      <div
        v-for="(option, index) of options"
        :key="option.id"
        class="combo-option"
        :class="{ 'glass-darker': selectedIndex === index }"
        role="option"
        :aria-selected="selectedIndex === index"
        @mousedown="updateValue(index)"
      >
        {{ displayOption(option) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue'

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
}>()

const isOpen = ref(false)
const selectedIndex = ref(0)
const valueIndex = computed(() =>
  options.value.findIndex(({ id }) => id === value.value)
)

watch(value, () => (selectedIndex.value = valueIndex.value))
const onBlur = () => (isOpen.value = false)

const toggleOpen = () => (isOpen.value = !isOpen.value)
const displayOption = (option: Option) => option.label ?? option.id

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
.combo {
  display: flex;
  flex-direction: column-reverse;

  --option-height: 23px;
  --radius: 8px;

  &-input {
    display: block;
    padding: 0 var(--radius);
    text-align: center;
    cursor: pointer;
    margin-top: 0.3em;
  }

  &-list {
    font-family: 'Inter';
    font-weight: 300;
    letter-spacing: 1px;
    font-size: 14px;
    border-radius: var(--radius);
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
    &:not(:last-child, :first-child) {
      margin: -1px 0;
      padding-top: 1px;
      padding-bottom: 1px;
    }
  }
}
</style>
