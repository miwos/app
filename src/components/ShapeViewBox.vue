<template>
  <svg
    :size="shape.size.width"
    :height="shape.size.height"
    :viewBox="`0 0 ${shape.size.width} ${shape.size.height}`"
  >
    <slot />
  </svg>
</template>

<script setup lang="ts">
import type { Shape } from 'shape-compiler'
const props = defineProps<{
  shape: Shape
}>()
</script>
