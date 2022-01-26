<template>
  <svg
    class="shape-outline"
    v-bind="{ width, height, viewBox }"
    v-html="shape.outline"
  ></svg>
</template>

<script setup lang="ts">
import { Shape } from 'shape-compiler'

const props = defineProps<{
  shape: Shape
}>()

const { width, height } = props.shape.size
const viewBox = `0 0 ${width} ${height}`
</script>
