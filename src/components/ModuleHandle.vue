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
    <svg viewBox="0 0 16 16">
      <circle class="module-handle-hit" cx="8" cy="8" r="8" />
      <circle class="module-handle-display" cx="8" cy="8" r="5" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { useConnections } from '@/store/connections'
import { useModuleInstances } from '@/store/moduleInstances'
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
  delta: Point
  angle: number
  instanceId: ModuleInstance['id']
}>()

const connections = useConnections()
const instances = useModuleInstances()
const instance = instances.find(props.instanceId)
const isHovered = ref(false)
const isDragging = ref(false)
const deltaWithUnit = computed(() => ({
  x: props.delta.x + 'px',
  y: props.delta.y + 'px',
}))

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
  console.log('start')
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

  top: v-bind('deltaWithUnit.y');
  left: v-bind('deltaWithUnit.x');

  svg {
    display: block;
    overflow: visible;
    width: 16px;
    height: 16px;
  }

  &-display {
    pointer-events: none;
    fill: var(--connection-point-color);
  }

  &-hit {
    fill: none;
  }

  &.active &-display {
    fill: var(--active-color);
  }

  &.active &-display,
  &:not(.connection-hovered) &-display {
    transition: fill var(--active-fade-duration);
  }

  &.module-focused &-display {
    fill: var(--module-focused-outline-color);
  }

  &.hovered &-display,
  &.connection-hovered &-display,
  &.connection-focused &-display {
    fill: var(--connection-highlight-color);
  }
}
</style>
