<template>
  <div class="prop" @dblclick="map">
    <div class="prop-point"></div>
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

  &-point,
  &-name {
    flex-shrink: 0;
  }

  &-point {
    width: 1em;
    height: 1em;
    border-radius: 50%;
    background-color: darkorchid;
  }
}

input {
  border: none;
  background-color: wheat;
  width: 3rem;
}
</style>
