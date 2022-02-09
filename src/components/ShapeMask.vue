<template>
  <svg class="shape-mask" v-bind="{ width, height, viewBox }">
    <clipPath :id="props.id" v-html="shape.path" />
  </svg>
</template>

<script setup lang="ts">
import type { Shape } from 'shape-compiler'
import { inject } from 'vue'

const props = defineProps<{
  id: string
}>()

const shape = inject<Shape>('shape')!
const { width, height } = shape.size
const viewBox = `0 0 ${width} ${height}`
</script>
