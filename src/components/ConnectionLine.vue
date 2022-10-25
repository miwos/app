<template>
  <svg class="connection-line">
    <line
      class="line-hit-area"
      :x1="fromPosition?.x"
      :y1="fromPosition?.y"
      :x2="toPosition?.x"
      :y2="toPosition?.y"
    />
    <line
      class="line-display"
      :x1="fromPosition?.x"
      :y1="fromPosition?.y"
      :x2="toPosition?.x"
      :y2="toPosition?.y"
    />
  </svg>
</template>

<script setup lang="ts">
import { useModules } from '@/stores/modules'
import type { Connection } from '@/types/Connection'
import { computed, toRefs } from 'vue'

const props = defineProps<{
  connection: Connection
}>()

const { from, to } = toRefs(props.connection)

const modules = useModules()

const fromPosition = computed(() => {
  const module = modules.items.get(from.value.moduleInstanceId)
  return module?.position
})

const toPosition = computed(() => {
  const module = modules.items.get(to.value.moduleInstanceId)
  return module?.position
})
</script>

<style scoped lang="scss">
.connection-line {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  outline: none;
}

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
  stroke: var(--color-connection);
  fill: none;
}
</style>
