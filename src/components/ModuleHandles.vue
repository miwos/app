<template>
  <div
    v-for="(handles, name) in props.handles"
    :key="name"
    class="module-handles"
    :class="name"
  >
    <ModuleHandle
      v-for="(handle, index) in handles"
      :key="index"
      :index="index"
      :instanceId="props.instanceId"
      v-bind="handle"
    />
  </div>
</template>

<script setup lang="ts">
import { ModuleInstance } from '@/store/moduleInstances'
import { ShapeHandles } from '@/store/shapes'
import ModuleHandle from './ModuleHandle.vue'

const props = defineProps<{
  handles: ShapeHandles
  instanceId: ModuleInstance['id']
}>()
</script>
