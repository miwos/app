<template>
  <div class="modules">
    <Module
      v-for="(module, id) in modules.items"
      :key="id"
      :id="module.id"
      :type="module.type"
      :category="modules.definitions[module.type].category"
      v-model:position="module.position"
      v-model:inputs="module.inputs"
      v-model:outputs="module.outputs"
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
</template>

<script setup lang="ts">
import { useModules } from './store/modules'
import { useConnections } from './store/connections'
import Module from './components/Module.vue'
import ConnectionLine from './components/ConnectionLine.vue'
import { useBridge } from './bridge'
import { usePatch } from './store/patch'

const bridge = useBridge()
const connections = useConnections()
const modules = useModules()
const patch = usePatch()
modules.init()

const points = [
  { x: 0, y: 0 },
  { x: 200, y: 133 },
  { x: 130, y: 300 },
  { x: 33, y: 233 },
  { x: 100, y: 167 },
]

const createModule = (type: string) =>
  modules.addModule(type, {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  })
</script>

<style lang="scss">
@import './config.css';

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

body {
  background-color: var(--background-color);

  &.dragging * {
    user-select: none;
  }
}
</style>
