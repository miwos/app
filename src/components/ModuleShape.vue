<template>
  <div class="module-shape" ref="el"></div>
</template>

<script setup lang="ts">
import { useShapes } from '@/store/shapes'
import { Shape } from 'shape-compiler'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  id: Shape['id']
}>()

const el = ref<HTMLElement | null>(null)
const shape = useShapes().find(props.id)

onMounted(() => {
  const shapeTemplate = document.getElementById(shape.templateId)

  if (!shapeTemplate?.firstChild)
    throw new Error(`Can't find template for shape '${props.id}'`)

  el.value?.prepend(shapeTemplate.firstChild.cloneNode(true))
})
</script>

<style lang="scss">
.module-shape svg {
  display: block;
  overflow: visible;
  height: auto;

  .outline {
    stroke: var(--module-outline-color);
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }

  .shape {
    fill: var(--module-shape-color);
  }

  * {
    vector-effect: non-scaling-stroke;
    stroke-width: 1px;
  }
}
</style>
