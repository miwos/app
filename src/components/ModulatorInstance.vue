<template>
  <div class="modulator glass-dark">
    <ScrollingPlot ref="plot" color="orange" />
  </div>
</template>

<script setup lang="ts">
import type { Modulator } from '@/types'
import ScrollingPlot from './ScrollingPlot.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { useEventBus } from '@vueuse/core'

const props = defineProps<{ modulator: Modulator }>()
const plot = ref<InstanceType<typeof ScrollingPlot>>()
const modulatorValueBus = useEventBus('modulator-value')
let unsubscribe: Function | undefined

onMounted(() => {
  unsubscribe = modulatorValueBus.on((modulatorId, value) => {
    if (modulatorId === props.modulator.id) plot.value?.plotValue(value)
  })
})

onUnmounted(() => unsubscribe?.())
</script>

<style lang="scss">
.modulator {
  height: 50px;
  width: 120px;
  box-sizing: border-box;
  padding: 5px 0;
  border-radius: var(--radius-s);
}
</style>
