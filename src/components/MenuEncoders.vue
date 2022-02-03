<template>
  <BaseMenu class="menu-encoders">
    <BaseEncoder :id="1" style="left: 40px" />
    <BaseEncoder :id="2" style="top: 58px" />
    <BaseEncoder :id="3" style="left: 40px; top: 116px" />
  </BaseMenu>
</template>

<script setup lang="ts">
import BaseEncoder from './BaseEncoder.vue'
import BaseMenu from './BaseMenu.vue'
</script>

<style scoped>
.menu-encoders {
  position: absolute;
  top: 50%;
  right: 0;
  width: 80px;
  height: 156px;
  transform: translateY(-50%);
}

.encoder {
  position: absolute;
}
</style>
