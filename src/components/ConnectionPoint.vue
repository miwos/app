<template>
  <div
    class="connection-point"
    ref="el"
    :class="{
      hovered: hovered || dragging,
      dragging,
      'connection-hovered': connectionHovered,
      'connection-focused': connectionFocused,
      'module-focused': moduleFocused,
    }"
    tabindex="-1"
    draggable="true"
    @mousedown.stop
    @mouseup.stop
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @dragstart="handleDragStart"
    @dragend="dragging = false"
    @dragenter="canConnect && (hovered = true)"
    @dragleave="hovered = false"
    @dragover.prevent
    @drop.prevent="handleDrop"
  ></div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useConnections } from '../store/connections'
import { useModules } from '../store/modules'
import { emptyImage } from '../utils'

const props = defineProps<{
  moduleId: number
  // Note: the index is one-based to be consistent with lua.
  index: number
  type: 'input' | 'output'
}>()

const connections = useConnections()
const modules = useModules()
const hovered = ref(false)
const dragging = ref(false)

const existsOnConnection = (connection: Connection | null) => {
  if (!connection) return false
  const { moduleId, index } =
    props.type === 'input' ? connection.to : connection.from
  return moduleId === props.moduleId && index === props.index
}

const connectionHovered = computed(() =>
  existsOnConnection(connections.hoveredConnection)
)

const connectionFocused = computed(() =>
  existsOnConnection(connections.focusedConnection)
)

const moduleFocused = computed(
  () =>
    modules.focusedModuleId !== null &&
    connections
      .connectedToModule(modules.focusedModuleId)
      .find((el) => existsOnConnection(el))
)

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
  hovered.value = false
}
</script>

<style lang="scss" scoped>
.connection-point {
  position: absolute;
  transform: translate(-50%, -50%);
  // z-index: var(--z-connection-point);
  z-index: 999;

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
