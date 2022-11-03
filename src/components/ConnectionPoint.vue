<template>
  <div
    class="connection-point"
    :class="{
      'dragged-over': isDraggedOver,
      dragging: isDragging,
    }"
    ref="el"
    draggable="true"
    @mousedown.stop
    @mouseup.stop
  >
    <MIcon class="icon" :type="`signal-${point.signal}`" />
  </div>
</template>

<script setup lang="ts">
import { connectFrom, connectTo } from '@/commands'
import { useDragDrop } from '@/composables/useDragDrop'
import { useConnections } from '@/stores/connections'
import { useModules } from '@/stores/modules'
import type { ConnectionPoint } from '@/types/Connection'
import { createEmptyImage } from '@/utils'
import { ref } from 'vue'
import MIcon from './MIcon.vue'

const props = defineProps<{
  point: ConnectionPoint
}>()

const el = ref<HTMLElement>()
const connections = useConnections()
const module = useModules().get(props.point.moduleId)

const handleDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return
  event.dataTransfer.setDragImage(createEmptyImage(), 0, 0)
  event.dataTransfer.dropEffect = 'link'
  connectFrom(props.point)

  if (module) {
    connections.tempConnection = {
      from: { moduleId: props.point.moduleId, index: props.point.index },
    }
  }
}

const handleDrag = (event: DragEvent) => {
  if (connections.tempConnection)
    connections.tempConnection.to = { x: event.clientX, y: event.clientY }
}

const handleDragOver = () => {
  if (!module || !connections.tempConnection) return
  // Snap the temporary connection on the connection point.
  connections.tempConnection.to = {
    moduleId: props.point.moduleId,
    index: props.point.index,
  }
}

const handleDragEnd = () => {
  connections.tempConnection = undefined
}

const handleDrop = () => {
  connectTo(props.point)
  connections.tempConnection = undefined
}

const { isDragging, isDraggedOver } = useDragDrop(el, {
  handleDragStart,
  handleDrag,
  handleDragOver,
  handleDragEnd,
  handleDrop,
})
</script>

<style scoped lang="scss">
.connection-point {
  position: absolute;
  transform: translate(-50%, -50%);
  top: v-bind('point.position.y + `px`');
  left: v-bind('point.position.x + `px`');

  &.dragging .icon,
  &.dragged-over {
    fill: red;
  }
}
</style>
