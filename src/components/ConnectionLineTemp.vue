<template>
  <svg class="connection-line-temp">
    <line
      :x1="fromPosition?.x"
      :y1="fromPosition?.y"
      :x2="toPosition?.x"
      :y2="toPosition?.y"
    />
  </svg>
</template>

<script setup lang="ts">
import type { Point, TemporaryConnection } from '@/types'
import { getConnectionPointPosition } from '@/utils'
import { computed, toRefs } from 'vue'

const props = defineProps<{
  connection: TemporaryConnection
}>()

const { connection } = toRefs(props)

const isPoint = (obj: any): obj is Point =>
  obj.x !== undefined && obj.y !== undefined

const fromPosition = computed(() => {
  const { from } = connection.value
  return getConnectionPointPosition(from.moduleId, from.index, 'out')
})

const toPosition = computed(() => {
  const { to } = connection.value
  if (!to) return
  return isPoint(to)
    ? to
    : getConnectionPointPosition(to.moduleId, to.index, 'in')
})
</script>

<style scoped lang="scss">
.connection-line-temp {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  outline: none;

  stroke-width: 1px;
  stroke: var(--color-connection);
  fill: none;
}
</style>
