<template>
  <div
    class="connection-point"
    ref="el"
    :class="{ focus, dragging }"
    draggable="true"
    @mousedown.stop
    @mouseup.stop
    @dragstart="handleDragStart"
    @dragover.prevent
    @dragenter="canConnect && (focus = true)"
    @dragleave="focus = false"
    @dragend="dragging = false"
    @drop.prevent="handleDrop"
  ></div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import { useConnections } from '../store/connections'
import { emptyImage } from '../utils'

const props = defineProps<{
  moduleId: number
  index: number
  type: 'input' | 'output'
}>()

const connections = useConnections()
const focus = ref(false)
const dragging = ref(false)

const handleDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return
  event.dataTransfer.setDragImage(emptyImage(), 0, 0)
  event.dataTransfer.dropEffect = 'link'
  const { moduleId, index, type } = props
  connections.connectFrom({ moduleId, index, type })
  dragging.value = true
}

const canConnect = computed(() => {
  if (!connections.startConnectionPoint) return false
  const { moduleId, type } = connections.startConnectionPoint
  return moduleId !== props.moduleId && type !== props.type
})

const handleDrop = () => {
  if (canConnect.value) {
    const { moduleId, index, type } = props
    connections.connectTo({ moduleId, index, type })
  }
  focus.value = false
}
</script>

<style lang="scss" scoped>
.connection-point {
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background: blue;

  &.dragging {
    background: aqua;
  }

  &.focus {
    background: yellowgreen;
  }
}
</style>
