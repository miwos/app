<template>
  <svg
    class="shape-mask"
    :viewBox="viewBox"
    :width="size.width"
    :height="size.height"
  >
    <clipPath :id="props.id" v-html="shape.path" />
  </svg>
</template>

<script setup lang="ts">
import type { Shape } from 'shape-compiler'
import { computed, ComputedRef, inject } from 'vue'

const props = defineProps<{
  id: string
}>()

const shape = inject<ComputedRef<Shape>>('shape')!
const size = computed(() => shape.value.size)
const viewBox = computed(() => `0 0 ${size.value.width} ${size.value.height}`)
</script>
