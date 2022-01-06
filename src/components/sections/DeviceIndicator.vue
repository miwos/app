<template>
  <div class="device-indicator">{{ connectionStatus }}</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBridge } from '@/bridge'

const bridge = useBridge()

const connectionStatus = computed(() =>
  bridge.isConnected.value ? 'connected' : 'disconnected'
)
</script>

<style scoped>
.device-indicator {
  position: absolute;
  top: 0;
  left: 0;
  height: 2rem;
  background-color: #767676;
}
</style>
