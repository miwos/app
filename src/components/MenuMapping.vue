<template>
  <BaseMenu class="menu-mapping glass pill">
    <BaseButtonCircleTriplet
      :value="mapping.currentPageIndex"
      @update:value="mapping.selectPage($event)"
    />
  </BaseMenu>
</template>

<script setup lang="ts">
import { useMapping } from '@/store/mapping'
import BaseMenu from './BaseMenu.vue'
import BaseButtonCircleTriplet from './BaseButtonCircleTriplet.vue'

const mapping = useMapping()
</script>

<style lang="scss" scoped>
.menu-mapping {
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
