<template>
  <div class="modules">
    <Module
      v-for="(module, id) in modules.items"
      :key="id"
      :id="module.id"
      :type="module.type"
      :definition="modules.definitions[module.type]"
      v-model:position="module.position"
    />
  </div>
  <div class="connections">
    <ConnectionLine
      v-for="(connection, index) in connections.items"
      :key="index"
      :from="connection.from"
      :to="connection.to"
    />
  </div>
</template>

<script setup lang="ts">
import { useModules } from './store/modules'
import { useConnections } from './store/connections'
import Module from './components/Module.vue'
import ConnectionLine from './components/ConnectionLine.vue'

const modules = useModules()
const connections = useConnections()

modules.clearAll()
connections.clearAll()

modules.addDefinition({ type: 'arp', inputs: 2, outputs: 3 })
modules.addModule('arp', { x: 100, y: 100 })
modules.addModule('arp', { x: 500, y: 500 })
</script>
