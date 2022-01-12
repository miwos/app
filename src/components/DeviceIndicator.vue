<template>
  <ButtonCircle
    class="device-indicator"
    :class="{ connected }"
    @click="toggleConnection"
  />
</template>

<script setup lang="ts">
import { useBridge } from '@/bridge'
import { computed } from 'vue'
import ButtonCircle from './ButtonCircle.vue'

const bridge = useBridge()

const connected = computed(() => bridge.isConnected.value)

const toggleConnection = () => {
  bridge.isConnected.value ? bridge.close() : bridge.connect()
}
</script>

<style lang="scss" scoped>
.device-indicator {
  --color: grey;

  &.connected {
    --color: salmon;
  }
}
</style>
