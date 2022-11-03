<template>
  <div class="module-outline" v-html="shape.path"></div>
</template>

<script setup lang="ts">
import { useModuleDefinitions } from '@/stores/moduleDefinitions'
import type { Module } from '@/types'
import { perforatePath, type Shape } from '@miwos/shape'
import { computed } from 'vue'

const props = defineProps<{ module: Module; shape: Shape }>()
const definitions = useModuleDefinitions()

const dash = computed(() => {
  const { shape } = props
  const definition = definitions.get(props.module.definition)
  if (!definition) return

  const holes = []

  for (let i = 0; i < definition.inputs.length; i++) {
    const { signal, offset } =
      definitions.getConnector(props.module.definition, i, 'in') ?? {}
    if (offset !== undefined && signal === 'midi') holes.push(offset)
  }
  for (let i = 0; i < definition.outputs.length; i++) {
    const { signal, offset } =
      definitions.getConnector(props.module.definition, i, 'out') ?? {}
    if (offset !== undefined && signal === 'midi') holes.push(offset)
  }
  return perforatePath(shape.pathLength, holes)
})
</script>

<style scoped lang="scss">
.module-outline {
  position: absolute;
  top: 0;
  left: 0;
  stroke: blue;
  stroke-width: 1px;
  fill: none;

  stroke-dasharray: v-bind('dash?.dashArray');
  stroke-dashoffset: v-bind('dash?.dashOffset');
  stroke-linecap: round;
  stroke-linejoin: round;

  &::v-deep(svg) {
    display: block;
    overflow: visible;
  }
}
</style>
