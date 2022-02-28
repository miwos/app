<template>
  <BaseComboBox
    :options="devices"
    :value="value"
    @update:value="emit('update:value', $event)"
  />
</template>

<script setup lang="ts">
import { useMidi } from '../store/midi'
import BaseComboBox from './BaseComboBox.vue'

defineProps<{
  value: any
}>()

const emit = defineEmits<{
  (e: 'update:value', device: any): void
}>()

const devices = useMidi().devices
</script>
