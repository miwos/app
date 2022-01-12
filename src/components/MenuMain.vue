<template>
  <BaseMenu>
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
.menu {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0.5rem;
}
</style>
