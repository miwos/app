<template>
  <div class="menu">
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
  </div>
</template>

<script setup lang="ts">
import { useBridge } from '@/bridge'
import { useModules } from '@/store/modules'
import { usePatch } from '@/store/patch'

const bridge = useBridge()
const modules = useModules()
const patch = usePatch()

const createModule = (type: string) =>
  modules.add(type, {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  })
</script>
