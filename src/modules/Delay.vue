<template>
  <canvas class="module-delay" ref="canvas"></canvas>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, watchEffect } from 'vue'
import { colord, extend } from 'colord'
import mix from 'colord/plugins/mix'
import { map } from '@/utils'
extend([mix])

const props = defineProps<{
  feed: number
  time: number
}>()

const canvas = ref<HTMLCanvasElement>()

let ctx: CanvasRenderingContext2D | null
let bounds: DOMRect
onMounted(() => {
  ctx = canvas.value!.getContext('2d')
  bounds = canvas.value!.getBoundingClientRect()
  canvas.value!.width = bounds.width
  canvas.value!.height = bounds.height

  draw()
})

const draw = () => {
  const { time, feed } = props
  const thresh = (feed / 100) * 0.01
  const repeats = Math.floor(Math.log(thresh) / Math.log((feed - 1) / 100))

  if (!ctx) return
  const { width, height } = bounds
  ctx.clearRect(0, 0, width, height)

  const thickness = map(time, 0, 1000, 5, 27)
  const visibleRepeats = Math.max(width, height) / thickness

  for (let i = repeats; i > 0; i--) {
    if (i > visibleRepeats) continue

    const mix = i / repeats
    const color = colord('#9800ff').mix('#929292', mix).toRgbString()
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, thickness * i, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
  }
}

watchEffect(draw)
</script>

<style lang="scss" scoped>
.module-delay {
  width: 100%;
  height: 100%;
}
</style>
