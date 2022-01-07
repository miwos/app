<template>
  <BaseMenu class="menu-parts">
    <ButtonCircleTriplet :value="0" />
  </BaseMenu>
</template>

<script setup lang="ts">
import BaseMenu from '../ui/BaseMenu.vue'
import ButtonCircleTriplet from '../ui/ButtonCircleTriplet.vue'
</script>

<style lang="scss" scoped>
.menu-parts {
  position: absolute;
  right: 0;
  top: 0;
  width: calc(var(--size) * 3);
  transform: rotate(90deg);
  gap: 0.5rem;
  display: block;
}

.button {
  --color: blue;
}
</style>
