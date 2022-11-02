<template>
  <ConnectionPoint v-for="point in points" :point="point" />
</template>

<script setup lang="ts">
import { useModuleDefinitions } from '@/stores/moduleDefinitions'
import type { ConnectionPoint as TConnectionPoint, Module } from '@/types'
import { toConnectionPoint } from '@/utils'
import { computed } from 'vue'
import ConnectionPoint from './ConnectionPoint.vue'

const props = defineProps<{ module: Module }>()
const definitions = useModuleDefinitions()

const points = computed((): TConnectionPoint[] => {
  const definition = definitions.get(props.module.definition)
  if (!definition) return []

  const points: TConnectionPoint[] = []

  for (let i = 0; i < definition.inputs.length; i++) {
    const point = toConnectionPoint(props.module, i, 'in')
    if (point) points.push(point)
  }

  for (let i = 0; i < definition.outputs.length; i++) {
    const point = toConnectionPoint(props.module, i, 'out')
    // A `thru` is a visually combined input and output. We only render the
    // corresponding input but omit the output.
    if (point && !point.thru) points.push(point)
  }

  return points
})
</script>
