<template>
  <svg class="connection-line" :class="{ hover: isHovering }">
    <line
      class="line-hit-area"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      @keydown.delete="remove"
      tabindex="-1"
      :x1="fromPoint.x"
      :y1="fromPoint.y"
      :x2="toPoint.x"
      :y2="toPoint.y"
    />
    <line
      class="line-display"
      :x1="fromPoint.x"
      :y1="fromPoint.y"
      :x2="toPoint.x"
      :y2="toPoint.y"
    ></line>
  </svg>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useInputPosition } from '../composables/useInputPosition'
import { useOutputPosition } from '../composables/useOutputPosition'
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

const fromPoint = useOutputPosition(fromModule, props.from.index)
const toPoint = useInputPosition(toModule, props.to.index)

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
    pointer-events: all;
    &:focus {
      outline: none;
    }
  }

  .line-display {
    stroke-width: 1px;
    stroke: black;
  }

  &.hover .line-display {
    stroke: blue;
  }
}
</style>
