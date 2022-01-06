<template>
  <div class="patch">
    <div class="modules">
      <Module
        v-for="(module, index) in modules.sorted"
        :key="module.id"
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
  </div>
</template>

<script setup lang="ts">
import { useModules } from '@/store/modules'
import { useConnections } from '@/store/connections'
import ConnectionLine from '@/components/patch/ConnectionLine.vue'
import Module from '@/components/patch/Module.vue'

const connections = useConnections()
const modules = useModules()
</script>

<style scoped>
.patch {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
