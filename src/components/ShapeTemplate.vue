<template>
  <div
    class="shape-template"
    v-html="sanitizeShapeSVG(props.svg)"
    ref="el"
  ></div>
</template>

<script setup lang="ts">
import { parseShape, sanitizeShapeSVG } from '@/utils'
import { removeHandlePlaceholders } from '@/utils/parseModuleShape'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  type: string
  svg: string
}>()
const el = ref<HTMLElement | null>(null)
const emit = defineEmits(['update:handles'])

const scaleShape = (svg: SVGElement) => {
  const width = svg.getAttribute('width')
  if (width) {
    const rems = parseInt(width) / 16
    svg.style.width = `${rems * 0.35}rem`
  }
}

onMounted(() => {
  const svg = el.value?.firstChild as SVGElement | null
  if (!svg) return

  svg.classList.add('module-shape')
  scaleShape(svg)
  const handles = parseShape(svg)
  removeHandlePlaceholders(svg)

  emit('update:handles', handles)
})
</script>

<style scoped lang="scss">
.shape-template {
  position: absolute;
  top: -9999px;
  left: -9999px;
}
</style>

<style lang="scss">
svg.module-shape {
  display: block;
  overflow: visible;
  height: auto;

  .outline {
    stroke: var(--module-stroke-color);
  }

  .background {
    fill: var(--module-fill-color);
  }

  * {
    vector-effect: non-scaling-stroke;
    stroke-width: 1px;
  }
}
</style>
