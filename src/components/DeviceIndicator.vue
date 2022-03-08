<template>
  <BaseButtonCircle
    class="device-indicator"
    :class="{ connected: device.isConnected }"
    @click="toggleConnection"
  />
</template>

<script setup lang="ts">
import { useDevice } from '@/stores/device'
import BaseButtonCircle from './BaseButtonCircle.vue'

const device = useDevice()
const toggleConnection = () => {
  device.isConnected ? device.disconnect() : device.connect()
}
</script>

<style lang="scss" scoped>
.device-indicator {
  background-color: var(--disabled-color);

  &.connected {
    background-color: var(--active-color);
    transition: background-color var(--fade-duration);
  }
}
</style>
