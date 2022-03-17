<template>
  <svg
    class="shape-outline"
    :viewBox="viewBox"
    :width="size.width"
    :height="size.height"
    v-html="shape.outline"
  ></svg>
</template>

<script setup lang="ts">
import { Module, ModuleInputOutput } from '@/types/Module'
import { Shape, perforatePath } from 'shape-compiler'
import { computed, ComputedRef, inject } from 'vue'

const shape = inject<ComputedRef<Shape>>('shape')!
const module = inject<ComputedRef<Module>>('module')!
const size = computed(() => shape.value.size)
const viewBox = computed(() => `0 0 ${size.value.width} ${size.value.height}`)

const dash = computed(() => {
  const holes = []

  for (let i = 0; i < module.value.inputs.length; i++) {
    const isMidi = module.value.inputs[i].signal === 'midi'
    const offset = shape.value.inputs[i].offset
    if (offset !== undefined && isMidi) holes.push(offset)
  }
  for (let i = 0; i < module.value.outputs.length; i++) {
    const isMidi = module.value.outputs[i].signal === 'midi'
    const offset = shape.value.outputs[i].offset
    if (offset !== undefined && isMidi) holes.push(offset)
  }

  return perforatePath(shape.value.length, holes)
})
</script>

<style scoped lang="scss">
.shape-outline {
  stroke-dasharray: v-bind('dash.dashArray');
  stroke-dashoffset: v-bind('dash.dashOffset');
}
</style>
