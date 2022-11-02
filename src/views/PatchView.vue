<template>
  <MenuAdd></MenuAdd>
  <div class="module-instances">
    <ModuleInstance
      v-for="moduleItem in modules.list"
      :key="moduleItem.id"
      :module="moduleItem"
      :position="moduleItem.position"
      @update:position="modules.update(moduleItem.id, 'position', $event)"
    ></ModuleInstance>
  </div>
  <div class="connections">
    <ConnectionLine
      v-for="connection in connections.list"
      :key="connection.id"
      :connection="connection"
    />
  </div>
</template>

<script setup lang="ts">
import ConnectionLine from '@/components/ConnectionLine.vue'
import MenuAdd from '@/components/MenuAdd.vue'
import ModuleInstance from '@/components/ModuleInstance.vue'
import { useConnections } from '@/stores/connections'
import { useModules } from '@/stores/modules'

const modules = useModules()
const connections = useConnections()
</script>
