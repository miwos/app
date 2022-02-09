<template>
  <ComboBox :options="devices" :value="value" @update:value="value = $event" />
</template>

<script setup lang="ts">
import { useMidi } from '../store/midi'
import ComboBox from './ComboBox.vue'

defineProps<{
  value: any
}>()

defineEmits<{
  (e: 'update:value', device: any): void
}>()

const devices = useMidi().devices
</script>
