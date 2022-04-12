<template>
  <div class="pattern-wrap">
    <div class="pattern-rect">
      <canvas class="pattern" ref="canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMessage } from '@/composables/onMessage'
import { useRaf } from '@/composables/useRaf'
import { onMounted, ref, watch, computed } from 'vue'
import { refAutoReset } from '@vueuse/core'

const canvas = ref<HTMLCanvasElement | null>(null)
let pattern: number[] = []
const startTime = ref(0)
const isRecording = ref(false)
const duration = ref(0)
const isMatching = refAutoReset(false, 200)
const color = computed(() => (isMatching.value ? '#00ce78' : '#00FFF0'))
const noteMinWidth = 2
const noteMaxWidth = 15
let recordingOffset = 0
let ctx: CanvasRenderingContext2D | null
let width = 0
let height = 0

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  ;({ width, height } = canvas.value.getBoundingClientRect())
  canvas.value.width = width
  canvas.value.height = height
})

onMessage('pattern', (...notes: number[]) => {
  pattern = notes
  duration.value = notes[notes.length - 1]
})

onMessage('recording', (...notes: number[]) => {
  pattern = notes.map((v) => v - recordingOffset)
})

onMessage('match', () => (isMatching.value = true))

onMessage('record', (state, time) => {
  if (state) {
    startRecording(time)
  } else {
    stopRecording()
  }
})

const startRecording = (time: number) => {
  recordingOffset = time
  isRecording.value = true
  startTime.value = performance.now()
  pattern = []
  start()
}

const stopRecording = () => {
  isRecording.value = false
  stop()
}

const { start, stop } = useRaf((time) => {
  duration.value = time - startTime.value
})

const draw = () => {
  if (!ctx) return

  let noteWidth = Math.max(
    noteMinWidth,
    Math.min(noteMaxWidth, 10000 / duration.value)
  )
  noteWidth = isRecording.value ? noteWidth : Math.round(noteWidth)

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = color.value
  ctx.strokeStyle = 'hsl(0, 0%, 48%)'

  for (const note of pattern) {
    let position = (note / duration.value) * (width - noteWidth)
    position = isRecording.value ? position : Math.round(position)
    ctx.fillRect(position, 0, noteWidth, height)
    ctx.beginPath()
    ctx.moveTo(position - 1, 0)
    ctx.lineTo(position - 1, height)
    ctx.stroke()
  }
}

watch([isRecording, duration, color], draw)
</script>

<style scoped lang="scss">
.pattern {
  display: block;
  width: 100%;
  height: 100%;

  &-rect {
    height: 100%;
    box-sizing: border-box;
    padding: 5px;
    background-color: hsl(0, 0%, 48%);
    border-left: 1px solid #989898;
  }

  &-wrap {
    padding-left: 25px; // Make some space for the inset input.
    height: 100%;
  }
}
</style>
