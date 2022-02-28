<template>
  <div class="menu-encoders">
    <BaseEncoder :id="1" style="left: 40px" />
    <BaseEncoder :id="2" style="top: 58px" />
    <BaseEncoder :id="3" style="left: 40px; top: 116px" />
  </div>
</template>

<script setup lang="ts">
import BaseEncoder from './BaseEncoder.vue'
</script>

<style scoped lang="scss">
@use '@/styles/utilities';

.menu-encoders {
  position: absolute;
  top: 50%;
  right: 0;
  width: 80px;
  height: 156px;
  transform: translateY(-50%);
  @include utilities.menu;
}

.encoder {
  position: absolute;
}
</style>
