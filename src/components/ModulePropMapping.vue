<template>
  <div class="module-prop-mapping">
    <BaseListBox
      class="module-prop-mapping-list"
      :value="1"
      :options="[
        { id: 1, label: 'Map to #1' },
        { id: 2, label: 'Map to #2' },
        { id: 3, label: 'Map to #3' },
      ]"
      @update:value="updateValue"
      @blur="emit('blur')"
    ></BaseListBox>
  </div>
</template>

<script setup lang="ts">
import { Encoder } from '@/types/Encoders'
import { onMounted, ref } from 'vue'
import BaseListBox from './BaseListBox.vue'

defineProps<{
  value?: Encoder['id']
}>()

const emit = defineEmits<{
  (e: 'update:value', value: any): void
  (e: 'blur'): void
}>()

const select = ref<HTMLSelectElement | null>(null)

onMounted(() => {
  select.value?.focus()
})

const updateValue = (value: any) => {
  emit('update:value', value)
  emit('blur')
}
</script>

<style scoped lang="scss">
.module-prop-mapping {
  font-family: 'Inter';
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 14px;
  white-space: nowrap;
  position: absolute;
  top: 0;
  left: 0;

  &-list {
    background-color: var(--mapping-color);
    --selected-color: hsl(155deg 58% 38%);
    color: hsl(0deg 0% 0% / 91%);
    font-weight: 400;
  }
}
</style>
