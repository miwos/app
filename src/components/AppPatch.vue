<template>
  <div class="patch">
    <div class="modules">
      <ModuleInstance
        v-for="instance in useInstances().sorted"
        :key="instance.id"
        :id="instance.id"
        :moduleId="instance.moduleId"
        :props="instance.props"
        v-model:position="instance.position"
      />
    </div>
    <div class="connections">
      <ConnectionLine
        v-for="(connection, index) in useConnections().items"
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
import { useConnections } from '@/store/connections'
import { useInstances } from '@/store/instances'
</script>

<style scoped>
.patch {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
