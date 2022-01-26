<template>
  <div class="patch">
    <div class="modules">
      <ModuleInstance
        v-for="(instance, index) in instances.sorted"
        :key="instance.id"
        :id="instance.id"
        :moduleId="instance.moduleId"
        :propValues="instance.propValues"
        v-model:position="instance.position"
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
import { useConnections } from '@/store/connections'
import ConnectionLine from '@/components/ConnectionLine.vue'
import ModuleInstance from '@/components/ModuleInstance.vue'
import { useInstances } from '@/store/instances'

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
