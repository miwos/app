<template>
  <BaseMenu class="menu-mappings">
    <ButtonCircleTriplet v-model:value="useInterfaces().currentPage" />
  </BaseMenu>
</template>

<script setup lang="ts">
import BaseMenu from './BaseMenu.vue'
import ButtonCircleTriplet from './ButtonCircleTriplet.vue'
import { useInterfaces } from '@/store/interfaces'
</script>

<style lang="scss" scoped>
.menu-mappings {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  gap: 0.5rem;
  display: flex;
}

.button {
  --color: blue;
}
</style>
