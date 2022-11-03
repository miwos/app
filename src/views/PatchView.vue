<template>
  <MenuAdd></MenuAdd>
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
      v-if="connections.tempConnection?.to"
      :connection="connections.tempConnection"
      :style="`z-index: ${modules.items.size}`"
    />
  </div>
</template>

<script setup lang="ts">
import ConnectionLine from '@/components/ConnectionLine.vue'
import ConnectionLineTemp from '@/components/ConnectionLineTemp.vue'
import MenuAdd from '@/components/MenuAdd.vue'
import ModuleInstance from '@/components/ModuleInstance.vue'
import { useConnections } from '@/stores/connections'
import { useModules } from '@/stores/modules'

const modules = useModules()
const connections = useConnections()
</script>
