<template>
  <div class="module-inputs-outputs">
    <ModuleInputOutput
      v-for="(inputOutput, id) in inputsOutputs"
      :key="id"
      :instanceId="props.instanceId"
      v-bind="inputOutput"
    />
  </div>
</template>

<script setup lang="ts">
import { ModuleInstance } from '@/types/ModuleInstance'
import { Shape } from 'shape-compiler'
import ModuleInputOutput from './ModuleInputOutput.vue'

const props = defineProps<{
  inputsOutputs: Shape['inputsOutputs']
  instanceId: ModuleInstance['id']
}>()
</script>
