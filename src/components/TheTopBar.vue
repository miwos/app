<template>
  <MNavBar class="m-top-bar">
    <MButtonCircle
      :style="`background-color: var(${indicatorColor})`"
      @click="toggleDeviceConnection"
    ></MButtonCircle>
    <button @click="device.open">Open</button>
    <button @click="device.close">Close</button>
  </MNavBar>
</template>

<script setup lang="ts">
import { useDevice } from '@/stores/device'
import MButtonCircle from '@/ui/MButtonCircle.vue'
import MNavBar from '@/ui/MNavBar.vue'
import { computed } from 'vue'

const device = useDevice()

const toggleDeviceConnection = () => {
  device.isConnected ? device.close() : device.open()
}

const indicatorColor = computed(() =>
  device.isConnected ? '--color-active' : '--color-disabled'
)
</script>

<style scoped>
.m-top-bar {
  padding-left: 0 !important;
}
</style>
