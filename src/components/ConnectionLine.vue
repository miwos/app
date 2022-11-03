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
import type { Connection } from '@/types/Connection'
import { getConnectionPointPosition } from '@/utils'
import { computed, toRefs } from 'vue'

const props = defineProps<{
  connection: Connection
}>()

const { from, to } = toRefs(props.connection)

const fromPosition = computed(() =>
  getConnectionPointPosition(from.value.moduleId, from.value.index, 'out')
)
const toPosition = computed(() =>
  getConnectionPointPosition(to.value.moduleId, to.value.index, 'in')
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
