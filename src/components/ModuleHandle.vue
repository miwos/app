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
    :[`data-${props.type}`]="props.index"
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
  ></div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Connection, useConnections } from '@/store/connections'
import { emptyImage } from '@/utils'
import { ShapeHandle } from '@/store/shapes'
import { ModuleInstance, useModuleInstances } from '@/store/moduleInstances'

const props = defineProps<{
  type: ShapeHandle['type']
  delta: Point
  angle: number
  index: number
  instanceId: ModuleInstance['id']
}>()

const connections = useConnections()
const instances = useModuleInstances()
const isHovered = ref(false)
const isDragging = ref(false)
const deltaWithUnit = computed(() => ({
  x: props.delta.x + 'px',
  y: props.delta.y + 'px',
}))

const existsOnConnection = (connection: Connection | null) => {
  if (!connection) return false
  const { instanceId, index } =
    props.type === 'input' ? connection.to : connection.from
  return instanceId === props.instanceId && index === props.index
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
    !!connections
      .listConnectedToInstance(instances.focusedId)
      .find((el) => existsOnConnection(el))
)

const isActiveOutput = () => false
const isConnectedToActiveOutput = () => false

// const isActiveOutput = () =>
//   instances.findHandle(props.instanceId, 'output', props.index)?.isActive

// const isConnectedToActiveOutput = () =>
//   !!connections
//     .listConnectedToInstance(props.instanceId)
//     .find(
//       (el) =>
//         el.to.instanceId === props.instanceId &&
//         instances.findHandle(el.from.instanceId, 'output', el.from.index)
//           ?.isActive
//     )

const isActive = computed(() =>
  props.type === 'input' ? isConnectedToActiveOutput() : isActiveOutput()
)

const handleDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return
  event.dataTransfer.setDragImage(emptyImage(), 0, 0)
  event.dataTransfer.dropEffect = 'link'
  const { type, index, instanceId } = props
  connections.connectFrom({ type, index, instanceId })
  isDragging.value = true
}

const canConnect = computed(() => {
  if (!connections.startPoint) return false
  const { instanceId, type } = connections.startPoint

  const areDifferentInstance = instanceId !== props.instanceId
  const areDifferent = type !== props.type
  const areTransform = type === 'transform' && !areDifferent

  return areDifferentInstance && (areDifferent || areTransform)
})

const handleDrop = () => {
  if (canConnect.value) {
    const { type, index, instanceId } = props
    connections.connectTo({ type, index, instanceId })
  }
  isHovered.value = false
}
</script>

<style scoped lang="scss">
.module-handle {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: var(--z-connection-point);

  top: v-bind('deltaWithUnit.y');
  left: v-bind('deltaWithUnit.x');

  --size: 10px;
  width: var(--size);
  height: var(--size);

  border-radius: 50%;
  background: var(--connection-point-color);

  // &.dragging {
  //   background: blue;
  // }

  &.active {
    background-color: red;
  }

  &.active,
  &:not(.connection-hovered) {
    transition: background-color var(--active-fade-duration);
  }

  &.module-focused {
    background-color: var(--module-focused-stroke-color);
  }

  &.hovered,
  &.connection-hovered,
  &.connection-focused {
    background-color: var(--connection-highlight-color);
  }
}
</style>
