<template>
  <div class="module-inputs-outputs">
    <ModuleInputOutput
      v-for="(inputOutput, id) in shape.inputsOutputs"
      :key="id"
      :instanceId="instance.id"
      v-bind="inputOutput"
    />
  </div>
</template>

<script setup lang="ts">
import { ModuleInstance } from '@/types/ModuleInstance'
import { Shape } from 'shape-compiler'
import { inject } from 'vue'
import ModuleInputOutput from './ModuleInputOutput.vue'

const instance = inject<ModuleInstance>('instance')!
const shape = inject<Shape>('shape')!
</script>
