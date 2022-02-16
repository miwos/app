<template>
  <component
    v-if="module?.component"
    :is="asyncComponent"
    v-bind="instance?.propValues"
  />
</template>

<script setup lang="ts">
import { Module } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { defineAsyncComponent, inject } from 'vue'

const module = inject<Module>('module')!
const instance = inject<ModuleInstance>('instance')

const asyncComponent = defineAsyncComponent(
  () => import(`../modules/${module!.component}`)
)
</script>
