<template>
  <BaseMenu class="menu-main glass pill">
    <DeviceIndicator />
    <button>File</button>
    <button>Edit</button>
    <button>Clear</button>
    RAM: {{ useBridge().usedMemory }}kb
  </BaseMenu>
</template>

<script setup lang="ts">
import BaseMenu from './BaseMenu.vue'
import DeviceIndicator from './DeviceIndicator.vue'
import { useBridge } from '@/services/bridge'
</script>

<style scoped lang="scss">
.menu-main {
  position: absolute;
  top: 0;
  left: 0;
  gap: 0.5em;
  padding-right: 1em;
}
</style>
