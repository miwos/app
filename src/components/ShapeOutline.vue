<template>
  <svg
    class="shape-outline"
    v-bind="{ width, height, viewBox }"
    v-html="shape.outline"
  ></svg>
</template>

<script setup lang="ts">
import type { Shape } from 'shape-compiler'
import { inject } from 'vue'

const shape = inject<Shape>('shape')!
const { width, height } = shape.size
const viewBox = `0 0 ${width} ${height}`
</script>
