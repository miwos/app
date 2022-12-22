<template>
  <MenuAdd />
  <TheEncoders />
  <div class="selection" v-if="isSelecting" :style="style"></div>
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
      v-if="connections.tempConnection?.from && connections.tempConnection?.to"
      :connection="connections.tempConnection"
      :style="`z-index: ${modules.items.size}`"
    />
  </div>
  <div class="background" ref="bg"></div>
</template>

<script setup lang="ts">
import { removeModules } from '@/commands'
import ConnectionLine from '@/components/ConnectionLine.vue'
import ConnectionLineTemp from '@/components/ConnectionLineTemp.vue'
import MenuAdd from '@/components/MenuAdd.vue'
import ModuleInstance from '@/components/ModuleInstance.vue'
import TheEncoders from '@/components/TheEncoders.vue'
import { useSelection } from '@/composables/useSelection'
import { useConnections } from '@/stores/connections'
import { useModules } from '@/stores/modules'
import { useProject } from '@/stores/project'
import { containsRect } from '@/utils'
import { useMagicKeys, whenever } from '@vueuse/core'
import { ref, watch } from 'vue'

const bg = ref<HTMLElement>()
const modules = useModules()
const connections = useConnections()
const project = useProject()

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

.selection {
  position: absolute;
  box-sizing: border-box;
  pointer-events: none;
  background: rgb(0 0 0 / 12%);
  border-radius: 7px;
}
</style>
