<template>
  <div class="menu-main">
    <DeviceIndicator />
    <button>File</button>
    <button>Edit</button>
    <button @click="clearPatch">Clear</button>
    <button @click="updateModules">Update Modules</button>
    <button @click="exportModules">Export Modules</button>
  </div>
</template>

<script setup lang="ts">
import { clearPatch } from '@/commands'
import { useModules } from '@/stores/modules'
import { serializeModule } from '@/stores/modules/utils'
import { downloadFile } from '@/utils'
import DeviceIndicator from './DeviceIndicator.vue'

const modules = useModules()

const updateModules = () => modules.loadFromDevice()

const exportModules = () => {
  const data = Array.from(modules.items.values()).map(serializeModule)
  downloadFile('modules', JSON.stringify(data))
}
</script>

<style scoped lang="scss">
@use '@/styles/utilities';

.menu-main {
  @include utilities.menu;
  @include utilities.glass;
  @include utilities.pill;
  position: absolute;
  top: 0;
  left: 0;
  gap: 0.5em;
  padding-right: 1em;
}
</style>
