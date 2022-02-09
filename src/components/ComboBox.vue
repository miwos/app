<template>
  <div class="combo">
    <button
      class="combo input"
      role="combobox"
      :aria-controls="listId"
      aria-haspopup="listbox"
      :aria-label="label"
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
      {{ options[valueIndex]?.label }}
    </button>
    <div
      v-if="isOpen"
      :id="listId"
      class="combo-list"
      role="listbox"
      :aria-label="label"
      tabindex="-1"
    >
      <div
        v-for="(option, index) of options"
        :key="option.id"
        :id="`${id}-option-${option.id}`"
        class="option"
        role="option"
        :aria-selected="selectedIndex === index"
        @mousedown="updateValue(index)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue'

const props = defineProps<{
  options: { id: any; label: string }[]
  value: any
}>()

const emit = defineEmits<{
  (e: 'update:value', value: any): void
}>()

const id = `combo-${Math.round(Math.random() * 1000)}`
const listId = `${id}-list`
const label = 'Select Midi Device'
const selectedIndex = ref(0)
const isOpen = ref(false)
const valueIndex = computed(() =>
  options.value.findIndex(({ id }) => id === value.value)
)

const { value, options } = toRefs(props)

const toggleOpen = () => (isOpen.value = !isOpen.value)
const onBlur = () => (isOpen.value = false)

watch(value, () => (selectedIndex.value = valueIndex.value))

const select = (index: number) => {
  const { length } = options.value
  selectedIndex.value = index < 0 ? length - 1 : index >= length ? 0 : index
}

const updateValue = (index: number) =>
  emit('update:value', options.value[index].id)

const selectNext = () => select(selectedIndex.value + 1)
const selectPrev = () => select(selectedIndex.value - 1)
const selectFirst = () => select(0)
const selectLast = () => select(options.value.length - 1)
</script>

<style scoped lang="scss">
.option[aria-selected='true'] {
  color: red;
}
</style>
