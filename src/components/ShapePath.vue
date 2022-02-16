<template>
  <svg
    class="shape-path"
    v-bind="{ width, height, viewBox }"
    v-html="shape.path"
  ></svg>
</template>

<script setup lang="ts">
import type { Shape } from 'shape-compiler'
import { inject } from 'vue'

const props = defineProps<{
  shape?: Shape
}>()
const shape = props.shape ?? inject<Shape>('shape')!
const { width, height } = shape.size
const viewBox = `0 0 ${width} ${height}`
</script>
