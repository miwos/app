<template>
  <div class="background" ref="bg"></div>
  <div class="selection" v-if="isSelecting" :style="style"></div>
  <div class="modulator-instances">
    <ModulatorInstance v-for="[id, item] in modulators.items" />
  </div>
  <div class="patch" :class="app.isOverlaying && 'dim'">
    <div class="module-instances">
      <ModuleInstance
        v-for="[id, item] in modules.items"
        :key="id"
        :module="item"
        v-model:position="item.position"
        :style="`z-index: ${modules.getSortIndex(id)}`"
      ></ModuleInstance>
    </div>
    <div class="connections">
      <ConnectionLine
        v-for="[id, connection] in connections.items"
        :key="id"
        :connection="connection"
        :style="`z-index: ${connections.getSortIndex(id)}`"
      />
      <ConnectionLineTemp
        v-if="
          connections.tempConnection?.from && connections.tempConnection?.to
        "
        :connection="connections.tempConnection"
        :style="`z-index: ${modules.items.size}`"
      />
    </div>
  </div>
  <TheEncoders />
  <MenuAdd />
</template>

<script setup lang="ts">
import { removeModules } from '@/commands'
import ConnectionLine from '@/components/ConnectionLine.vue'
import ConnectionLineTemp from '@/components/ConnectionLineTemp.vue'
import MenuAdd from '@/components/MenuAdd.vue'
import ModulatorInstance from '@/components/ModulatorInstance.vue'
import ModuleInstance from '@/components/ModuleInstance.vue'
import TheEncoders from '@/components/TheEncoders.vue'
import { useSelection } from '@/composables/useSelection'
import { useApp } from '@/stores/app'
import { useConnections } from '@/stores/connections'
import { useModulators } from '@/stores/modulators'
import { useModules } from '@/stores/modules'
import { useProject } from '@/stores/project'
import { containsRect } from '@/utils'
import { useMagicKeys, whenever } from '@vueuse/core'
import { ref, watch } from 'vue'

const bg = ref<HTMLElement>()
const modules = useModules()
const modulators = useModulators()
const connections = useConnections()
const project = useProject()
const app = useApp()

const { style, rect, cancel, isSelecting } = useSelection(bg)
const keys = useMagicKeys()

const selectModules = () => {
  modules.selectedIds.clear()
  for (const [id, { position, size }] of modules.items) {
    if (!size) continue
    const { x, y } = position
    const { width, height } = size
    const moduleRect = { x, y, width, height }
    if (containsRect(rect.value, moduleRect)) modules.selectedIds.add(id)
  }
}

watch(isSelecting, (value) => (project.isSelecting = value))
watch(rect, selectModules)

whenever(keys['escape'], () => {
  modules.selectedIds.clear()
  cancel()
})

whenever(keys['delete'], () => removeModules(modules.selectedIds))
</script>

<style scoped lang="scss">
.background {
  width: 100vw;
  height: 100vh;
}

.patch {
  // Create a new stacking context, so modules and connections don't
  // overlay menus and dialogs.
  isolation: isolate;

  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 100ms ease;

  &.dim {
    opacity: 0.3;
  }
}

.modulator-instances {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  margin: 1rem;
}

.selection {
  position: absolute;
  box-sizing: border-box;
  pointer-events: none;
  background: rgb(0 0 0 / 12%);
  border-radius: 7px;
}
</style>
