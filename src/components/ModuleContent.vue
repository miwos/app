<template>
  <div class="module-content">
    <component
      v-if="module?.component"
      :is="asyncComponent"
      v-bind="instance?.propValues"
    />
  </div>
</template>

<script setup lang="ts">
import { Module } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { computed, defineAsyncComponent, inject } from 'vue'

const module = inject<Module>('module')!
const instance = inject<ModuleInstance>('instance')

const asyncComponent = defineAsyncComponent(
  () => import(`../modules/${module!.component}`)
)
</script>

<style scoped>
.module-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
