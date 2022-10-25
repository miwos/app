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
import type { ConnectionPoint } from '@/types/Connection'
import { useDragDrop } from '@/composables/useDragDrop'
import { ref } from 'vue'
import MIcon from './MIcon.vue'
import { connectFrom, connectTo } from '@/commands'
import { createEmptyImage } from '@/utils'

const props = defineProps<{
  point: ConnectionPoint
}>()

const el = ref<HTMLElement>()

const handleDrag = (event: DragEvent) => {
  if (!event.dataTransfer) return
  event.dataTransfer.setDragImage(createEmptyImage(), 0, 0)
  event.dataTransfer.dropEffect = 'link'
  connectFrom(props.point)
}

const handleDrop = () => connectTo(props.point)

const { isDragging, isDraggedOver } = useDragDrop(el, handleDrag, handleDrop)
</script>

<style scoped lang="scss">
.connection-point {
  &.dragging .icon,
  &.dragged-over {
    fill: red;
  }
}
</style>
