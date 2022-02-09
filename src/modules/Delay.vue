<template>
  <canvas class="module-delay" ref="canvas"></canvas>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { colord, extend } from 'colord'
import mix from 'colord/plugins/mix'
extend([mix])

const props = defineProps<{
  feedback: number
}>()

const canvas = ref<HTMLCanvasElement>()
const thresh = 0.1
const repeats = computed(() =>
  Math.floor(Math.log(thresh) / Math.log(props.feedback))
)

let ctx: CanvasRenderingContext2D | null
let bounds: DOMRect
onMounted(() => {
  ctx = canvas.value!.getContext('2d')
  bounds = canvas.value!.getBoundingClientRect()
  canvas.value!.width = bounds.width
  canvas.value!.height = bounds.height
})

watch(repeats, () => {
  if (!ctx) return
  const { width, height } = bounds
  ctx.clearRect(0, 0, width, height)
  for (let i = repeats.value; i > 0; i--) {
    const mix = i / repeats.value
    const color = colord('#9800ff').mix('#929292', mix).toRgbString()
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, (width / 10) * i, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
  }
})
</script>

<style lang="scss" scoped>
.module-delay {
  width: 100%;
  height: 100%;
}
</style>
