<template>
  <svg
    ref="el"
    class="connection-line"
    :class="{
      hovered: isHovered,
      focused: isFocused,
      active: isActive,
      'module-focused': instanceIsFocused,
    }"
    @mouseenter="connections.hover(props.id)"
    @mouseleave="connections.hover(null)"
    @focus="connections.focus(props.id)"
    @blur="connections.focus(null)"
    @keydown.delete="remove"
    tabindex="-1"
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
import { ref, watchEffect, computed } from 'vue'
import { useConnectionCurve } from '@/composables/useConnectionCurve'
import { useConnections } from '@/store/connections'
import { useModules } from '@/store/modules'
import { useModuleInstances } from '@/store/moduleInstances'
import { ConnectionPoint } from '@/types/Connection'

const props = defineProps<{
  id: string
  from: ConnectionPoint
  to: ConnectionPoint
}>()

const modules = useModules()
const instances = useModuleInstances()
const connections = useConnections()

const curve = useConnectionCurve(props.from, props.to)

const el = ref<HTMLElement | null>(null)
const isHovered = connections.isHovered(props.id)
const isFocused = connections.isFocused(props.id)

const isActive = computed(() =>
  instances.find(props.from.instanceId).activeHandleIds.has(props.from.id)
)

const instanceIsFocused = computed(
  () =>
    instances.focusedId !== null &&
    !!connections
      .listConnectedToInstance(instances.focusedId)
      .find((el) => el.id === props.id)
)

const focus = () => el.value?.focus()
const blur = () => el.value?.blur()
watchEffect(() => (isFocused.value ? focus() : blur()))

const remove = () => connections.remove(props.id)
</script>

<style scoped lang="scss">
.connection-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;

  .line-hit-area {
    stroke-width: 20px;
    pointer-events: stroke;

    fill: none;

    &:focus {
      outline: none;
    }

    // The hit area is covering the connection points, so we hide the hit area
    // as soon as module is hovered, so we can easily access the connection
    // points.
    // body.module-hover & {
    //   display: none;
    // }
  }

  .line-display {
    stroke-width: 1px;
    stroke: var(--connection-color);
    fill: none;
  }

  &.module-focused {
    z-index: var(--z-focused-module);
    .line-display {
      stroke: var(--module-focused-outline-color);
    }
  }

  &.active .line-display {
    stroke: var(--active-color);
    transition: stroke 0.2s;
  }

  &.active,
  &:not(.hovered) {
    .line-display {
      transition: stroke var(--active-fade-duration);
    }
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
