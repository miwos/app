<template>
  <div class="prop" @dblclick="map">
    <div class="prop-point" v-html="knobSvg"></div>
    <div class="prop-name">
      <span>{{ props.name }}</span
      >&nbsp;
      <input
        type="number"
        :value="props.value"
        @change="$emit('update:value', parseInt(($event.target as HTMLInputElement)?.value))"
      />
    </div>
    <div class="prop-mapping" v-if="showMapping">
      <select
        ref="mappingSelect"
        :value="encoder"
        @change="$emit('update:encoder', parseInt(($event.target as HTMLInputElement)?.value))"
        @blur="showMapping = false"
      >
        <option value="1">Encoder 1</option>
        <option value="2">Encoder 2</option>
        <option value="3">Encoder 3</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import knobSvg from '@/assets/knob.svg?raw'

const props = defineProps<{
  name: string
  value: number
  encoder: number
}>()

const mappingSelect = ref<HTMLElement | null>(null)
const showMapping = ref(false)

const map = async () => {
  showMapping.value = true
  await nextTick()
  mappingSelect.value?.focus()
}
</script>

<style lang="scss" scoped>
.prop {
  display: flex;
  align-items: center;
  gap: 0.5em;
  color: var(--module-stroke-color);
  font-family: 'Vevey positive';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: antialiased;

  &-point,
  &-name {
    flex-shrink: 0;
  }

  &-point {
    --size: 1.4rem;
    width: var(--size);
    height: var(--size);
    &:deep(path) {
      fill: var(--module-fill-color);
    }
  }
}

input {
  border: none;
  background-color: white;
  width: 3rem;
}
</style>
