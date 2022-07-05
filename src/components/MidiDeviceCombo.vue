<template>
  <BaseComboBox
    :options="devices"
    :value="value"
    :prefix="direction"
    @update:value="emit('update:value', $event)"
  />
</template>

<script setup lang="ts">
import { useMidi } from '../stores/midi'
import BaseComboBox from './BaseComboBox.vue'

defineProps<{
  value: any
  direction: 'Input' | 'Output'
}>()

const emit = defineEmits<{
  (e: 'update:value', device: any): void
}>()

const devices = useMidi().devices
</script>
