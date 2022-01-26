<template>
  <svg class="shape-mask" v-bind="{ width, height, viewBox }">
    <clipPath :id="id" v-html="shape.path" />
  </svg>
</template>

<script setup lang="ts">
import { Shape } from 'shape-compiler'

const props = defineProps<{
  id: string
  shape: Shape
}>()

const { width, height } = props.shape.size
const viewBox = `0 0 ${width} ${height}`
</script>
