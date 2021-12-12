<template>
  <nav class="mapping-navigation">
    <DeviceButton class="active" />
    <DeviceButton />
    <DeviceButton />
  </nav>
</template>

<script setup lang="ts">
import DeviceButton from '@/components/ui/DeviceButton.vue'
</script>

<style lang="scss" scoped>
.mapping-navigation {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  gap: 0.5rem;
  display: flex;
}

.device-button {
  --color: #00fa68;
  --border-color: #00cd55;
}
</style>
