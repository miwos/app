<template>
  <div class="menu-mapping">
    <BaseButtonCircleTriplet
      :value="mapping.currentPageIndex"
      @update:value="mapping.selectPage($event)"
    />
  </div>
</template>

<script setup lang="ts">
import { useMapping } from '@/store/mapping'
import BaseButtonCircleTriplet from './BaseButtonCircleTriplet.vue'

const mapping = useMapping()
</script>

<style lang="scss" scoped>
@use '@/styles/utilities';

.menu-mapping {
  position: absolute;
  bottom: 0;
  right: 0;
  margin-right: 2rem;
  gap: 0.5rem;
  display: flex;
  @include utilities.menu;
  @include utilities.glass;
  @include utilities.pill;
}

.button-circle-triplet {
  --color: var(--mapping-color);
}
</style>
