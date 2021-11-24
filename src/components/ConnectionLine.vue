<template>
  <svg
    ref="el"
    class="connection-line"
    :class="{ hovered, focused, 'module-focused': moduleFocused }"
    @mouseenter="connections.hover(props.id)"
    @mouseleave="connections.hover(null)"
    @focus="connections.focus(props.id)"
    @blur="connections.focus(null)"
    @keydown.delete="remove"
    tabindex="-1"
  >
    <path class="line-hit-area" :d="curve.description" />
    <path class="line-display" :d="curve.description" />
    <!-- <circle
      v-for="handle in curve.handles"
      :cx="handle.x"
      :cy="handle.y"
      r="5"
      fill="svgrey"
    /> -->
  </svg>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { useConnectionCurve } from '../composables/useConnectionCurve'
import { useConnections } from '../store/connections'
import { useModules } from '../store/modules'

const props = defineProps<{
  id: string
  from: ConnectionPoint
  to: ConnectionPoint
}>()

const modules = useModules()
const connections = useConnections()

const fromModule = modules.items[props.from.moduleId]
const toModule = modules.items[props.to.moduleId]

const curve = useConnectionCurve(
  fromModule,
  props.from.index,
  toModule,
  props.to.index
)

const el = ref<HTMLElement | null>(null)
const hovered = connections.isHovered(props.id)
const focused = connections.isFocused(props.id)

const moduleFocused = computed(
  () =>
    modules.focusedModuleId !== null &&
    connections
      .connectedToModule(modules.focusedModuleId)
      .find((el) => el.id === props.id)
)

const focus = () => el.value?.focus()
const blur = () => el.value?.blur()
watchEffect(() => (focused.value ? focus() : blur()))

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
      stroke: var(--module-focused-stroke-color);
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
