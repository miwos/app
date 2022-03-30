<template>
  <svg
    ref="el"
    class="connection-line"
    :class="{
      hovered: isHovered,
      focused: isFocused,
      active: isMidi ? isActive : triggerIsActive,
      instanceFocused: instanceIsFocused,
    }"
    tabindex="0"
    @mousedown="connections.focus(id)"
    @mouseenter="connections.hover(id)"
    @mouseleave="connections.hover(undefined)"
    @keydown.delete="remove"
  >
    <path class="line-hit-area" :d="curve.data" />
    <path class="line-display" :d="curve.data" />
    <!-- <circle
      v-for="control in curve.controls"
      :cx="control.x"
      :cy="control.y"
      r="5"
      fill="svgrey"
    /> -->
  </svg>
</template>

<script setup lang="ts">
import { onMouseDownOutside } from '@/composables/onMouseDownOutside'
import { useConnectionCurve } from '@/composables/useConnectionCurve'
import { useConnections } from '@/stores/connections'
import { useInstances } from '@/stores/instances'
import { Connection, ConnectionPoint } from '@/types/Connection'
import { autoResetRef } from '@vueuse/core'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  id: Connection['id']
  from: ConnectionPoint
  to: ConnectionPoint
}>()

const instances = useInstances()
const connections = useConnections()
const curve = useConnectionCurve(props.from, props.to)
const el = ref<HTMLElement | null>(null)
const isHovered = connections.isHovered(props.id)
const isFocused = connections.isFocused(props.id)
const isActive = computed(() => connections.activeIds.has(props.id))

const isMidi = computed(() => props.from.signal === 'midi')

const triggerIsActive = autoResetRef(false, 100)
watchEffect(() => isActive.value && (triggerIsActive.value = true))

const instanceIsFocused = computed(
  () =>
    instances.focusedId !== null &&
    !!connections
      .listConnectedToInstance(instances.focusedId)
      .find((el) => el.id === props.id)
)

watchEffect(() => (isFocused.value ? el.value?.focus() : el.value?.blur()))
onMouseDownOutside(el, () => connections.focus(undefined))
const remove = () => connections.remove(props.id)
</script>

<style scoped lang="scss">
.connection-line {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  .line-hit-area {
    pointer-events: stroke;
    stroke-width: 20px;
    fill: none;

    &:focus {
      outline: none;
    }
  }

  .line-display {
    stroke-width: 1px;
    stroke: var(--connection-color);
    fill: none;
  }

  &.instanceFocused {
    z-index: var(--z-focused-module);
    .line-display {
      stroke: var(--module-focused-outline-color);
    }
  }

  &.active .line-display {
    stroke: var(--active-color);
    transition: stroke 0.2s;
  }

  &.active .line-display,
  &:not(.hovered) .line-display {
    transition: stroke var(--fade-duration);
  }

  &.hovered,
  &.focused {
    z-index: var(--z-focused-connection);
    .line-display {
      stroke: var(--connection-highlight-color);
    }
  }
}
</style>
