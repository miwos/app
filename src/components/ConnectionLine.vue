<template>
  <svg class="connection-line">
    <line :x1="fromPoint.x" :y1="fromPoint.y" :x2="toPoint.x" :y2="toPoint.y" />
  </svg>
</template>

<script setup lang="ts">
import { computed, defineProps, toRefs } from 'vue'
import { useInputPosition } from '../composables/useInputPosition'
import { useOutputPosition } from '../composables/useOutputPosition'
import { useModules } from '../store/modules'

const props = defineProps<{
  from: ConnectionPoint
  to: ConnectionPoint
}>()

const modules = useModules()

const fromModule = modules.items[props.from.moduleId]
const toModule = modules.items[props.to.moduleId]

const fromPoint = useOutputPosition(fromModule, props.from.index)
const toPoint = useInputPosition(toModule, props.to.index)
</script>

<style scoped>
.connection-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  stroke: black;
}
</style>
