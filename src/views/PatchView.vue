<template>
  <MenuAdd></MenuAdd>
  <div class="module-instances">
    <ModuleInstance
      v-for="[id, module] in modules.items"
      :key="id"
      :module="module"
      v-model:position="module.position"
    ></ModuleInstance>
  </div>
  <div class="connections">
    <ConnectionLine
      v-for="[id, connection] in connections.items"
      :key="id"
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
