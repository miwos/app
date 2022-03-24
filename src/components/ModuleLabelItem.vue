<template>
  <div class="module-label-item">{{ text }}</div>
</template>

<script setup lang="ts">
import { ShapeLabel } from 'shape-compiler'

const props = defineProps<{
  text: string
  info: ShapeLabel
}>()
</script>

<style scoped lang="scss">
.module-label-item {
  position: absolute;
  top: 0;
  left: 0;

  width: v-bind('props.info.length + `px`');
  text-align: v-bind('props.info.align');

  --angle: v-bind('props.info.angle + `deg`');
  --x: v-bind('props.info.position.x + `px`');
  --y: v-bind('props.info.position.y + `px`');

  transform-origin: top left;
  transform: translate(var(--x), var(--y)) rotate(var(--angle))
    translateY(-100%);
}
</style>
