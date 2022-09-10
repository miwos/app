<template>
  <MNavBar class="m-top-bar">
    <MButtonCircle
      :style="`background-color: var(${statusColor})`"
      @click="toggleDeviceConnection"
    ></MButtonCircle>
    <button @click="toggleDeviceConnection">{{ statusText }}</button>
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

const statusColor = computed(() =>
  device.isConnected ? '--color-active' : '--color-disabled'
)

const statusText = computed(() =>
  device.isConnected ? 'Disconnect' : 'Connect'
)
</script>

<style scoped>
.m-top-bar {
  padding-left: 0 !important;
}
</style>
