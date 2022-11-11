<template>
  <svg class="connection-line">
    <path class="line-selected" v-if="isSelected" :d="path?.data" />
    <path class="line-display" :d="path?.data" />
    <path class="line-hit-area" :d="path?.data" />
    <g v-if="debug">
      <circle
        v-for="{ x, y } in path?.controls"
        class="control-point"
        :cx="x"
        :cy="y"
        r="5"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { useConnectionPath } from '@/composables/useConnectionPath'
import { useModules } from '@/stores/modules'
import type { Connection } from '@/types/Connection'
import { getConnectionPoint } from '@/utils'
import { computed, toRefs } from 'vue'

const props = defineProps<{
  connection: Connection
}>()

const { from, to } = toRefs(props.connection)
const modules = useModules()

const debug = true

const isSelected = computed(
  () =>
    modules.selectedIds.has(from.value.moduleId) ||
    modules.selectedIds.has(to.value.moduleId)
)

const path = useConnectionPath(props.connection)
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

.line-selected {
  stroke: rgb(0 0 0 / 16%);
  stroke-width: 8px;
  fill: none;
}

.control-point {
  fill: blue;
}
</style>
