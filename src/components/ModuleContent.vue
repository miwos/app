<template>
  <div class="module-content" :style="{ clipPath: mask }">
    <component :is="modules.get(props.module.type)" v-bind="module.props" />
  </div>
</template>

<script setup lang="ts">
import type { Module } from '@/types'
import { defineAsyncComponent } from 'vue'

const props = defineProps<{ module: Module; mask: string }>()

const modulesImport = import.meta.glob('../modules/content/*.vue')
const modules = new Map(
  Object.entries(modulesImport).map(([path, asyncModule]) => {
    const name = path.match(/\/([\w_-]+).vue$/)![1]
    return [name, defineAsyncComponent(asyncModule as any)]
  })
)
</script>

<style lang="scss">
.module-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
