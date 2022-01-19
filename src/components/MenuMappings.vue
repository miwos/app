<template>
  <BaseMenu class="menu-mappings">
    <ButtonCircleTriplet v-model:value="useMapping().currentPage" />
  </BaseMenu>
</template>

<script setup lang="ts">
import BaseMenu from './BaseMenu.vue'
import ButtonCircleTriplet from './ButtonCircleTriplet.vue'
import { useMapping } from '@/store/mapping'
</script>

<style lang="scss" scoped>
.menu-mappings {
  position: absolute;
  bottom: 0;
  right: 0;
  margin-right: 2rem;
  gap: 0.5rem;
  display: flex;
}

.button-circle-triplet {
  --color: #00ce78;
}
</style>
