<template>
  <div class="menu-encoders-pages">
    <BaseButtonCircleTriplet
      :value="encoders.currentPageIndex"
      @update:value="encoders.selectPage($event)"
    />
  </div>
</template>

<script setup lang="ts">
import { useEncoders } from '@/stores/encoders'
import BaseButtonCircleTriplet from './BaseButtonCircleTriplet.vue'
const encoders = useEncoders()
</script>

<style lang="scss" scoped>
@use '@/styles/utilities';

.menu-encoders-pages {
  @include utilities.menu;
  @include utilities.glass;
  @include utilities.pill;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-right: 2rem;
  gap: 0.5rem;
  display: flex;
}

.button-circle-triplet {
  --color: var(--mapping-color);
}
</style>
