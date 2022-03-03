<template>
  <svg
    class="shape-outline"
    :viewBox="viewBox"
    :width="size.width"
    :height="size.height"
    v-html="shape.outline"
  ></svg>
</template>

<script setup lang="ts">
import type { Shape } from 'shape-compiler'
import { computed, ComputedRef, inject } from 'vue'

const props = defineProps<{
  shape?: Shape
}>()

const shape = inject<ComputedRef<Shape>>('shape')!
const size = computed(() => shape.value.size)
const viewBox = computed(() => `0 0 ${size.value.width} ${size.value.height}`)
</script>
