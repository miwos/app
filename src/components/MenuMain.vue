<template>
  <BaseMenu class="menu-main glass pill">
    <DeviceIndicator />
    <button>File</button>
    <button>Edit</button>
    <button>Clear</button>
  </BaseMenu>
</template>

<script setup lang="ts">
import DeviceIndicator from './DeviceIndicator.vue'
import BaseMenu from './BaseMenu.vue'
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
