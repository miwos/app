<template>
  <div class="patch">
    <div class="modules">
      <ModuleInstance
        v-for="instance in instances.sorted"
        :key="instance.id"
        :instance="instance"
        v-model:position="instance.position"
      />
    </div>
    <div class="connections">
      <ConnectionLine
        v-for="(connection, index) in connections.list"
        :key="index"
        :from="connection.from"
        :to="connection.to"
        :id="connection.id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ConnectionLine from '@/components/ConnectionLine.vue'
import ModuleInstance from '@/components/ModuleInstance.vue'
import { useConnections } from '@/stores/connections'
import { useInstances } from '@/stores/instances'

const connections = useConnections()
const instances = useInstances()
</script>

<style scoped>
.patch {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
