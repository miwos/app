<template>
  <ShapeTemplate
    v-for="shape in shapes.items"
    :id="shape.templateId"
    :svg="shape.svg"
    :type="shape.type"
    @update:handles="shape.handles = $event"
  />
</template>

<script setup lang="ts">
import { useShapes } from '@/store/shapes'
import ShapeTemplate from './ShapeTemplate.vue'

const shapes = useShapes()
</script>
