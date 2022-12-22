<template>
  <div class="encoders" :class="{ 'show-labels': app.isMapping }">
    <MEncoder :enabled="!!encoders[0]" v-bind="encoders[0]" class="encoder" />
    <MEncoder :enabled="!!encoders[1]" v-bind="encoders[0]" class="encoder" />
    <MEncoder :enabled="!!encoders[2]" v-bind="encoders[0]" class="encoder" />
  </div>
</template>

<script setup lang="ts">
import { useApp } from '@/stores/app'
import MEncoder from '@/ui/MEncoder.vue'
const app = useApp()

const encoders: { min: number; max: number }[] = []
</script>

<style scoped lang="scss">
.encoders {
  position: absolute;
  top: 50%;
  right: 0;
  width: 80px;
  height: 156px;
  transform: translateY(-50%);
  margin: 1rem;
  counter-reset: encoder;
}

.encoder {
  position: absolute;
  counter-increment: encoder;

  &:nth-child(1) {
    left: 40px;
  }

  &:nth-child(2) {
    top: 58px;
  }

  &:nth-child(3) {
    top: 116px;
    left: 40px;
  }

  &::before {
    position: absolute;
    transform: translateX(-100%);
    content: counter(encoder);
    padding-top: 0.67em;
    padding-right: 0.5em;
    font-size: 16px;
    font-family: 'Vevey Positive';
    color: var(--color-module-bg);
    opacity: 0;
    transition: opacity 100ms;
  }

  .show-labels &::before {
    opacity: 1;
  }
}
</style>
