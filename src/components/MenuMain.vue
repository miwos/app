<template>
  <BaseMenu class="menu-main">
    <DeviceIndicator />
    <button>File</button>
    <button>Edit</button>
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
  height: 2.5rem;
}
</style>
