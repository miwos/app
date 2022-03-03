<template>
  <div class="module-inputs-outputs">
    <ModuleInputOutput
      v-for="inputOutput in inputsOutputs"
      :key="inputOutput.id"
      v-bind="inputOutput"
    />
  </div>
</template>

<script setup lang="ts">
import {
  Module,
  ModuleInputOutput as ModuleInputOutputType,
} from '@/types/Module'
import { Shape } from 'shape-compiler'
import { computed, ComputedRef, inject } from 'vue'
import ModuleInputOutput from './ModuleInputOutput.vue'

const shape = inject<ComputedRef<Shape>>('shape')!
const module = inject<ComputedRef<Module>>('module')!

// Technically we only have two 'real' directions ('in' and 'out'). But we also
// use a pseudo direction 'inout' in the shape, which is used to combine an
// input and an output visually. So each time we encounter an `inout` we assign
// the corresponding input with the same index to it and add a flag.
const inputsOutputs = computed(() =>
  Object.values(shape.value.inputsOutputs)
    .map(({ id, index, direction }) => {
      const isInOut = direction === 'inout'
      const inputId = `in-${index}` as ModuleInputOutputType['id']
      const inputOutput = module.value.inputsOutputs[isInOut ? inputId : id]
      return inputOutput && { ...inputOutput, isInOut }
    })
    .filter((v) => !!v)
)
</script>
