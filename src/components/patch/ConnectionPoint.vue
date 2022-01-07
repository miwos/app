<template>
  <div
    class="connection-point"
    ref="el"
    :class="{
      hovered: isHovered || isDragging,
      active: isActive,
      dragging: isDragging,
      'connection-hovered': isConnectionHovered,
      'connection-focused': isConnectionFocused,
      'module-focused': isModuleFocused,
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
  ></div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useConnections } from '@/store/connections'
import { useModules } from '@/store/modules'
import { emptyImage } from '@/utils'

const props = defineProps<{
  moduleId: number
  // Note: the index is one-based to be consistent with lua.
  index: number
  type: 'input' | 'output'
}>()

const connections = useConnections()
const modules = useModules()
const isHovered = ref(false)
const isDragging = ref(false)

const existsOnConnection = (connection: Connection | null) => {
  if (!connection) return false
  const { moduleId, index } =
    props.type === 'input' ? connection.to : connection.from
  return moduleId === props.moduleId && index === props.index
}

const isConnectionHovered = computed(() =>
  existsOnConnection(connections.hoveredConnection)
)

const isConnectionFocused = computed(() =>
  existsOnConnection(connections.focusedConnection)
)

const isModuleFocused = computed(
  () =>
    modules.focusedModuleId !== null &&
    connections
      .connectedToModule(modules.focusedModuleId)
      .find((el) => existsOnConnection(el))
)

const isActiveOutput = () =>
  modules.getOutput(props.moduleId, props.index - 1)?.isActive

const isConnectedToActiveOutput = () =>
  !!connections
    .connectedToModule(props.moduleId)
    .find(
      (el) =>
        el.to.moduleId === props.moduleId &&
        modules.getOutput(el.from.moduleId, el.from.index - 1)?.isActive
    )

const isActive = computed(() =>
  props.type === 'input' ? isConnectedToActiveOutput() : isActiveOutput()
)

const handleDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return
  event.dataTransfer.setDragImage(emptyImage(), 0, 0)
  event.dataTransfer.dropEffect = 'link'
  const { moduleId, index, type } = props
  connections.connectFrom({ moduleId, index, type })
  isDragging.value = true
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
  isHovered.value = false
}
</script>

<style lang="scss" scoped>
.connection-point {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: var(--z-connection-point);

  top: var(--y);
  left: var(--x);

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
