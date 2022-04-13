<template>
  <component
    v-if="module?.component"
    :is="asyncComponent"
    v-bind="propValues"
    :props="props"
  />
</template>

<script setup lang="ts">
import { Module } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { computed, ComputedRef, defineAsyncComponent, inject } from 'vue'

const module = inject<ComputedRef<Module>>('module')!
const instance = inject<ComputedRef<ModuleInstance>>('instance')!

const props = computed(() =>
  Object.fromEntries(instance.value?.props.entries())
)

const propValues = computed(() =>
  Object.fromEntries(
    Object.entries(props.value).map(([name, v]) => [name, v.value])
  )
)

const asyncComponent = defineAsyncComponent(
  () => import(`../modules/${module.value.component}`)
)
</script>
