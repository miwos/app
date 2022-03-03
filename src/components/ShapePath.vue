<template>
  <svg
    class="shape-path"
    :viewBox="viewBox"
    :width="size.width"
    :height="size.height"
    v-html="shape.path"
  ></svg>
</template>

<script setup lang="ts">
import type { Shape } from 'shape-compiler'
import { computed, ComputedRef, inject } from 'vue'

const props = defineProps<{
  shape?: Shape
}>()

const shape = computed(
  () => props.shape ?? inject<ComputedRef<Shape>>('shape')!.value
)
const size = computed(() => shape.value.size)
const viewBox = computed(() => `0 0 ${size.value.width} ${size.value.height}`)
</script>
