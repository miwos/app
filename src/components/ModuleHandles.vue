<template>
  <ModuleHandle
    v-for="(handle, id) in handles"
    :key="id"
    :instanceId="props.instanceId"
    v-bind="handle"
  />
</template>

<script setup lang="ts">
import { ModuleInstance } from '@/types/ModuleInstance'
import { Shape } from 'shape-compiler'
import ModuleHandle from './ModuleHandle.vue'

const props = defineProps<{
  handles: Shape['handles']
  instanceId: ModuleInstance['id']
}>()
</script>
