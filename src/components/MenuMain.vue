<template>
  <div class="menu-main-wrap">
    <div class="menu-main">
      <DeviceIndicator />
      <button>Undo</button>
      <button>Redo</button>
      <button @click="clearPatch">Clear</button>
      <!-- <button @click="exportPatch">Export patch</button> -->
      <!-- <button @click="updateModules">Update Modules</button>
    <button @click="exportModules">Export Modules</button> -->
    </div>
    <button class="button-reset" @click="resetPatch">Restore</button>
  </div>
</template>

<script setup lang="ts">
import { clearPatch } from '@/commands'
import { useModules } from '@/stores/modules'
import { serializeModule } from '@/stores/modules/utils'
import { usePatch } from '@/stores/patch'
import { serializePatch } from '@/stores/patch/utils'
import { downloadFile } from '@/utils'
import DeviceIndicator from './DeviceIndicator.vue'

const modules = useModules()
const patch = usePatch()
const updateModules = () => modules.restoreAllFromDevice()

const exportModules = () => {
  const data = Array.from(modules.items.values()).map(serializeModule)
  downloadFile('modules', JSON.stringify(data))
}

const exportPatch = () =>
  downloadFile('patch', JSON.stringify(serializePatch()))

const resetPatch = () => patch.reset()
</script>

<style scoped lang="scss">
@use '@/styles/utilities';

.menu-main-wrap {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
}

.menu-main {
  @include utilities.menu;
  @include utilities.glass;
  @include utilities.pill;
  gap: 0.5em;
  padding-right: 1em;
}

.button-reset {
  @include utilities.font-menu;
  border-radius: var(--radius-s);
  background-color: hsl(281deg 100% 84%);
  padding: 0.4em 0.8em;
  cursor: pointer;
}
</style>
