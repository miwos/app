<template>
  <div
    class="module-input-output"
    ref="el"
    :class="{
      hovered: isHovered || isDragging,
      active: isMidi ? outputIsActive : triggerIsActive,
      dragging: isDragging,
      connectionHovered: isConnectionHovered,
      connectionFocused: isConnectionFocused,
      instanceFocused: isInstanceFocused,
    }"
    tabindex="-1"
    draggable="true"
    @mousedown.stop
    @mouseup.stop
    @dragover.prevent
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @dragstart="handleDragStart"
    @dragenter="canConnect && (isHovered = true)"
    @dragleave="isHovered = false"
    @dragend="isDragging = false"
    @drop.prevent="handleDrop"
  >
    <svg width="12" height="10" viewBox="0 0 12 10">
      <circle
        v-if="isMidi"
        class="module-input-output-path signal-midi"
        cx="6"
        cy="5"
        r="5"
      />
      <polygon
        v-else
        class="module-input-output-path signal-trigger"
        points="0,10 12,10 6,0"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { useConnections } from '@/stores/connections'
import { useInstances } from '@/stores/instances'
import { Connection, ConnectionPoint } from '@/types/Connection'
import { ModuleInputOutput } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { connectionPointsAreEqual, emptyImage } from '@/utils'
import { refAutoReset } from '@vueuse/core'
import { Shape } from 'shape-compiler'
import { computed, ComputedRef, inject, ref, watch, watchEffect } from 'vue'

const props = defineProps<{
  index: number
  direction: ConnectionPoint['direction']
  signal: ModuleInputOutput['signal']
  isInOut?: boolean
}>()

const connections = useConnections()
const instances = useInstances()
const instance = inject<ComputedRef<ModuleInstance>>('instance')!
const shape = inject<ComputedRef<Shape>>('shape')!

const connectionPoint = computed(() => ({
  ...props,
  id: `${instance.value.id}-${props.index}` as ConnectionPoint['id'],
  isInOut: shapeInputOutput.value?.isInOut,
  instanceId: instance.value.id,
}))
const canConnect = computed(
  () => connections.canConnect(connectionPoint.value).value
)
const isHovered = ref(false)
const isDragging = ref(false)

const outputIsActive = computed(() => {
  const id = `${instance.value.id}-${props.index}` as ConnectionPoint['id']

  return props.direction === 'in'
    ? instances.activeInputs.has(id)
    : instances.activeOutputs.has(id)
})

const triggerIsActive = refAutoReset(false, 100)
watchEffect(() => outputIsActive.value && (triggerIsActive.value = true))

const isMidi = computed(() => props.signal === 'midi')
const shapeInputOutput = computed(() => {
  const { inputs, outputs } = shape.value
  return props.direction === 'in' ? inputs[props.index] : outputs[props.index]
})

const position = computed(() => {
  if (!shapeInputOutput.value) return
  const { position } = shapeInputOutput.value
  return isMidi.value ? position.inset : position.touching
})

const angle = computed(() => shapeInputOutput.value?.angle ?? 0)

const existsOnConnection = (connection?: Connection) => {
  if (!connection) return false
  const { from, to } = connection
  return (
    connectionPointsAreEqual(connectionPoint.value, from) ||
    connectionPointsAreEqual(connectionPoint.value, to)
  )
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
    (instances.focusedId === instance.value.id ||
      !!connections
        .listConnectedToInstance(instances.focusedId)
        .find((el) => existsOnConnection(el)))
)

const handleDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return
  event.dataTransfer.setDragImage(emptyImage(), 0, 0)
  event.dataTransfer.dropEffect = 'link'
  connections.connectFrom(connectionPoint.value)
  isDragging.value = true
}

const handleDrop = () => {
  if (canConnect.value) {
    connections.connectTo(connectionPoint.value)
  }
  isHovered.value = false
}
</script>

<style scoped lang="scss">
.module-input-output {
  display: block;
  position: absolute;
  transform: translate(-50%, -50%);
  top: v-bind('position.y + `px`');
  left: v-bind('position.x + `px`');
  z-index: var(--z-connection-point);

  svg {
    display: block;
    overflow: visible;

    .signal-trigger {
      --angle: v-bind('angle - 90 + `deg`');
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
  &:not(.connectionHovered) &-path {
    transition: fill var(--fade-duration);
  }

  &.instanceFocused &-path {
    fill: var(--module-focused-outline-color);
  }

  &.hovered &-path,
  &.connectionHovered &-path,
  &.connectionFocused &-path {
    fill: var(--connection-highlight-color);
  }
}
</style>
