<template>
  <div class="modules">
    <Module
      v-for="(module, id) in modules.items"
      :key="id"
      :id="module.id"
      :type="module.type"
      v-model:position="module.position"
      v-model:inputDeltas="module.inputDeltas"
      v-model:outputDeltas="module.outputDeltas"
    />
  </div>
  <div class="connections">
    <ConnectionLine
      v-for="(connection, index) in connections.items"
      :key="index"
      :from="connection.from"
      :to="connection.to"
      :id="connection.id"
    />
  </div>
  <div>
    <span>{{ bridge.usedMemory }}</span>
    <button
      v-for="definition of modules.definitions"
      @click="createModule(definition.type)"
    >
      {{ definition.type }}
    </button>
  </div>
  <button @click="bridge.connect()">Connect</button>
  <button @click="bridge.close()">Close</button>
  <button @click="patch.update()">Patch</button>
  <button @click="bridge.init()">Init</button>
  <button @click="patch.clear()">Clear</button>
  <div>{{ bridge.isConnected }}</div>
  <Logger></Logger>
</template>

<script setup lang="ts">
import { createLuaPatch } from './utils'
import { useModules } from './store/modules'
import { useConnections } from './store/connections'
import Module from './components/Module.vue'
import ConnectionLine from './components/ConnectionLine.vue'
import Logger from './components/Logger.vue'
import { useBridge } from './bridge'
import { usePatch } from './store/patch'

const bridge = useBridge()
const connections = useConnections()
const modules = useModules()
const patch = usePatch()
modules.init()

const createModule = (type: string) =>
  modules.addModule(type, {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  })
</script>

<style lang="scss">
body {
  &.dragging * {
    user-select: none;
  }
}
</style>
