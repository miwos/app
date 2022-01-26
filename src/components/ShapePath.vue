<template>
  <svg
    class="shape-path"
    v-bind="{ width, height, viewBox }"
    v-html="shape.path"
  ></svg>
</template>

<script setup lang="ts">
import type { Shape } from 'shape-compiler'

const props = defineProps<{
  shape: Shape
}>()

const { width, height } = props.shape.size
const viewBox = `0 0 ${width} ${height}`
</script>
