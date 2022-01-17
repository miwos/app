<template>
  <div
    v-for="shape in shapes.items"
    class="shape-template"
    :id="shape.templateId"
    v-html="shape.svg"
  ></div>
</template>

<script setup lang="ts">
import { useShapes } from '@/store/shapes'
const shapes = useShapes()
</script>

<style scoped lang="scss">
.shape-template {
  position: absolute;
  top: -9999px;
  left: -9999px;
}
</style>
