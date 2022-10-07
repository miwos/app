<template>
  <MenuAdd></MenuAdd>
  <div class="module-instances">
    <ModuleInstance
      v-for="[id, instance] in moduleInstances.items"
      :key="id"
      v-model:position="instance.position"
    ></ModuleInstance>
  </div>
</template>

<script setup lang="ts">
import MenuAdd from '@/components/MenuAdd.vue'
import ModuleInstance from '@/components/ModuleInstance.vue'
import { useModuleInstances } from '@/stores/moduleInstances'

const moduleInstances = useModuleInstances()
</script>
