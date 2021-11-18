<template>
  <svg class="connection-line" :class="{ hover: isHovering }">
    <path
      class="line-hit-area"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      @keydown.delete="remove"
      tabindex="-1"
      :d="curve.description"
    />
    <path class="line-display" :d="curve.description" />
    <!-- <circle
      v-for="handle in curve.handles"
      :cx="handle.x"
      :cy="handle.y"
      r="5"
      fill="grey"
    /> -->
  </svg>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useConnectionCurve } from '../composables/useConnectionCurve'
import { useConnections } from '../store/connections'
import { useModules } from '../store/modules'

const props = defineProps<{
  id: string
  from: ConnectionPoint
  to: ConnectionPoint
}>()

const modules = useModules()
const connections = useConnections()

const fromModule = modules.items[props.from.moduleId]
const toModule = modules.items[props.to.moduleId]

const curve = useConnectionCurve(
  fromModule,
  props.from.index,
  toModule,
  props.to.index
)

const isHovering = ref(false)

const remove = () => connections.removeConnection(props.id)
</script>

<style scoped lang="scss">
.connection-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;

  .line-hit-area {
    stroke-width: 10px;
    pointer-events: stroke;
    fill: none;

    &:focus {
      outline: none;
    }

    // The hit area is covering the connection points, so we hide the hit area
    // as soon as module is hovered, so we can easily access the connection
    // points.
    body.module-hover & {
      display: none;
    }
  }

  .line-display {
    stroke-width: 1px;
    stroke: var(--connection-color);
    fill: none;
  }

  &.hover,
  &:focus-within {
    .line-display {
      stroke: var(--connection-highlight-color);
    }
  }
}
</style>
