<template>
  <div class="module-picker">
    <button
      v-for="(module, id) of modules.items"
      :key="id"
      @click="createModule(id)"
    >
      {{ id }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useModuleInstances } from '@/store/moduleInstances'
import { Module, useModules } from '@/store/modules'
const modules = useModules()
const instances = useModuleInstances()

const createModule = (id: Module['id']) =>
  instances.add(id, {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  })
</script>

<style scoped lang="scss">
.module-picker {
  position: absolute;
  left: 0;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  margin: 1rem;
}
</style>
