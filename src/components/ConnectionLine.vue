<template>
  <svg class="connection-line">
    <line
      class="line-hit-area"
      :x1="fromPosition?.x"
      :y1="fromPosition?.y"
      :x2="toPosition?.x"
      :y2="toPosition?.y"
    />
    <line
      class="line-display"
      :x1="fromPosition?.x"
      :y1="fromPosition?.y"
      :x2="toPosition?.x"
      :y2="toPosition?.y"
    />
  </svg>
</template>

<script setup lang="ts">
import { useModules } from '@/stores/modules'
import type { Module } from '@/types'
import type { Connection } from '@/types/Connection'
import { toConnectionPoint } from '@/utils'
import { computed, toRefs } from 'vue'

const props = defineProps<{
  connection: Connection
}>()

const { from, to } = toRefs(props.connection)
const modules = useModules()

const getPosition = (
  moduleId: Module['id'],
  index: number,
  direction: 'in' | 'out'
) => {
  const module = modules.get(moduleId)
  if (!module) return { x: 0, y: 0 }
  const connectionPoint = toConnectionPoint(module, index, direction)
  if (!connectionPoint) return { x: 0, y: 0 }

  return {
    x: module.position.x + connectionPoint.position.x,
    y: module.position.y + connectionPoint.position.y,
  }
}

const fromPosition = computed(() =>
  getPosition(from.value.moduleId, from.value.index, 'out')
)
const toPosition = computed(() =>
  getPosition(to.value.moduleId, to.value.index, 'in')
)
</script>

<style scoped lang="scss">
.connection-line {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  outline: none;
}

.line-hit-area {
  pointer-events: stroke;
  stroke-width: 20px;
  fill: none;
  &:focus {
    outline: none;
  }
}

.line-display {
  stroke-width: 1px;
  stroke: var(--color-connection);
  fill: none;
}
</style>
