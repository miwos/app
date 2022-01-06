<template>
  <div class="menu">
    <DeviceIndicator />
    <MappingNavigation />
    <PartNavigation />
    <ModulePicker />
  </div>
</template>

<script setup lang="ts">
import { useBridge } from '@/bridge'
import { useModules } from '@/store/modules'
import { usePatch } from '@/store/patch'
import DeviceIndicator from './DeviceIndicator.vue'
import MappingNavigation from './MappingNavigation.vue'
import PartNavigation from './PartNavigation.vue'
import ModulePicker from './ModulePicker.vue'

const bridge = useBridge()
const modules = useModules()
const patch = usePatch()

const createModule = (type: string) =>
  modules.add(type, {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  })
</script>
