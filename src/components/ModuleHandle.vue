<template>
  <div
    class="module-handle"
    ref="el"
    :class="{
      hovered: isHovered || isDragging,
      active: isActive,
      dragging: isDragging,
      'connection-hovered': isConnectionHovered,
      'connection-focused': isConnectionFocused,
      'module-focused': isInstanceFocused,
    }"
    tabindex="-1"
    draggable="true"
    @mousedown.stop
    @mouseup.stop
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @dragstart="handleDragStart"
    @dragend="isDragging = false"
    @dragenter="canConnect && (isHovered = true)"
    @dragleave="isHovered = false"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <svg width="12" height="10" viewBox="0 0 12 10">
      <circle
        v-if="props.signal === 'midi'"
        class="module-handle-path signal-midi"
        cx="6"
        cy="5"
        r="5"
      />
      <polygon
        v-else
        class="module-handle-path signal-trigger"
        points="0,10 12,10 6,0"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { useConnections } from '@/store/connections'
import { useInstances } from '@/store/instances'
import { Connection } from '@/types/Connection'
import { ModuleInstance } from '@/types/ModuleInstance'
import { Point } from '@/types/Point'
import { emptyImage, pointsAreEqual } from '@/utils'
import { Handle } from 'shape-compiler'
import { computed, ref } from 'vue'

const props = defineProps<{
  id: Handle['id']
  index: number
  signal: Handle['signal']
  direction: Handle['direction']
  position: Point
  angle: number
  instanceId: ModuleInstance['id']
}>()

const connections = useConnections()
const instances = useInstances()
const instance = instances.get(props.instanceId)
const isHovered = ref(false)
const isDragging = ref(false)
const isActive = computed(() => instance.activeHandleIds.has(props.id))

const canConnect = connections.canConnect(props)

const existsOnConnection = (connection: Connection | null) => {
  if (!connection) return false
  const { from, to } = connection
  return pointsAreEqual(props, from) || pointsAreEqual(props, to)
}

const isConnectionHovered = computed(() =>
  existsOnConnection(connections.hovered)
)

const isConnectionFocused = computed(() =>
  existsOnConnection(connections.focused)
)

const isInstanceFocused = computed(
  () =>
    instances.focusedId !== null &&
    (instances.focusedId === props.instanceId ||
      !!connections
        .listConnectedToInstance(instances.focusedId)
        .find((el) => existsOnConnection(el)))
)

const handleDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return
  event.dataTransfer.setDragImage(emptyImage(), 0, 0)
  event.dataTransfer.dropEffect = 'link'
  const { id, signal, direction, index, instanceId } = props
  connections.connectFrom({ id, signal, direction, index, instanceId })
  isDragging.value = true
}

const handleDrop = () => {
  if (canConnect.value) {
    const { id, signal, direction, index, instanceId } = props
    connections.connectTo({ id, signal, direction, index, instanceId })
  }
  isHovered.value = false
}
</script>

<style scoped lang="scss">
.module-handle {
  display: block;
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: var(--z-connection-point);

  top: v-bind('position.y + `px`');
  left: v-bind('position.x + `px`');

  svg {
    display: block;
    overflow: visible;

    .signal-trigger {
      --angle: v-bind('props.angle - 90 + `deg`');
      transform: translateY(-50%) rotate(var(--angle));
      transform-origin: bottom center;
    }
  }

  &-path {
    fill: var(--connection-point-color);
    stroke: transparent;
    // We want the hit area to be 3px wider than the display. The stroke is
    // is drawn on the center so we have to use a 6px stroke.
    stroke-width: 6;
    paint-order: stroke;
  }

  &.active &-path {
    fill: var(--active-color);
  }

  &.active &-path,
  &:not(.connection-hovered) &-path {
    transition: fill var(--active-fade-duration);
  }

  &.module-focused &-path {
    fill: var(--module-focused-outline-color);
  }

  &.hovered &-path,
  &.connection-hovered &-path,
  &.connection-focused &-path {
    fill: var(--connection-highlight-color);
  }
}
</style>
