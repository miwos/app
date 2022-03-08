<template>
  <div class="menu-main">
    <DeviceIndicator />
    <button>File</button>
    <button>Edit</button>
    <button>Clear</button>
    RAM: {{ useDevice().usedMemory }}kb
  </div>
</template>

<script setup lang="ts">
import DeviceIndicator from './DeviceIndicator.vue'
import { useDevice } from '@/stores/device'
</script>

<style scoped lang="scss">
@use '@/styles/utilities';

.menu-main {
  @include utilities.menu;
  @include utilities.glass;
  @include utilities.pill;
  position: absolute;
  top: 0;
  left: 0;
  gap: 0.5em;
  padding-right: 1em;
}
</style>
