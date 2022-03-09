<template>
  <div class="module-inputs-outputs">
    <ModuleInputOutput
      v-for="(input, index) in inputs"
      :key="`in-${index}`"
      :index="index"
      direction="in"
      v-bind="input"
    />
    <ModuleInputOutput
      v-for="(output, index) in outputs"
      :key="`out-${index}`"
      :index="index"
      direction="out"
      v-bind="output"
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

const inputs = computed(() => module.value.inputs)

// An `inout` is an input and an output that are visually combined. So we only
// render the input that belongs to an `inout` and omit the output.
const outputs = computed(() =>
  module.value.outputs.filter((v, index) => !shape.value.outputs[index].isInOut)
)
</script>
