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
import { Module } from '@/types/Module'
import { Shape } from 'shape-compiler'
import { computed, ComputedRef, inject } from 'vue'
import ModuleInputOutput from './ModuleInputOutput.vue'

const module = inject<ComputedRef<Module>>('module')!
const shape = inject<ComputedRef<Shape>>('shape')!

const inputsOutputs = computed(() =>
  // An `inout` is an input and an output that are visually combined. So we only
  // render the input that belongs to an `inout` and omit the output. The input
  // still has the `isInOut` flag so we treat it specifically.
  Object.values(module.value.inputsOutputs).filter(
    (v) => !(v.direction === 'out' && shape.value.inputsOutputs[v.id]?.isInOut)
  )
)
</script>
