<template>
  <nav class="parts-navigation">
    <DeviceButton class="active" />
    <DeviceButton />
    <DeviceButton />
  </nav>
</template>

<script setup lang="ts">
import DeviceButton from '@/components/ui/DeviceButton.vue'
</script>

<style lang="scss" scoped>
.parts-navigation {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
}

.device-button {
  --color: blue;
  --border-color: #0000d6;
}
</style>
