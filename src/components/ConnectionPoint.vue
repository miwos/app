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
import type { ConnectionPoint } from '@/types/Connection'
import { createEmptyImage } from '@/utils'
import { ref } from 'vue'
import MIcon from './MIcon.vue'

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
  position: absolute;
  transform: translate(-50%, -50%);
  top: v-bind('point.position.y + `px`');
  left: v-bind('point.position.x + `px`');

  &.dragging .icon,
  &.dragged-over {
    fill: red;
  }

  svg {
    display: block;
  }
}
</style>
