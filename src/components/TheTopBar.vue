<template>
  <MNavBar class="m-top-bar">
    <MButtonCircle
      :color="device.isConnected ? 'red' : 'gray'"
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

const device = useDevice()

const toggleDeviceConnection = () => {
  device.isConnected ? device.close() : device.open()
}
</script>

<style scoped>
.m-top-bar {
  padding-left: 0 !important;
}
</style>
