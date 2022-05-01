<template>
  <div class="menu-encoders" :class="{ label: app.isMapping }">
    <BaseEncoder :id="1" style="left: 40px; --label: '1'" />
    <BaseEncoder :id="2" style="top: 58px; --label: '2'" />
    <BaseEncoder :id="3" style="left: 40px; --label: '3'; top: 116px" />
  </div>
</template>

<script setup lang="ts">
import { useApp } from '@/stores/app'
import BaseEncoder from './BaseEncoder.vue'
const app = useApp()
</script>

<style scoped lang="scss">
@use '@/styles/utilities';

.menu-encoders {
  @include utilities.menu;
  position: absolute;
  top: 50%;
  right: 0;
  width: 80px;
  height: 156px;
  transform: translateY(-50%);
}

.encoder {
  position: absolute;
  .menu-encoders.label &::before {
    position: absolute;
    transform: translateX(-100%);
    content: var(--label);
    padding-top: 0.67em;
    padding-right: 0.5em;
    font-size: 16px;
    font-family: 'Vevey Positive';
    color: var(--module-shape-color);
  }
}
</style>
