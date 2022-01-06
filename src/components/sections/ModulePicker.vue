<template>
  <div class="module-picker">
    <button
      v-for="(definition, id) of modules.definitions"
      :key="id"
      @click="createModule(definition.type)"
    >
      {{ definition.type }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useModules } from '@/store/modules'
const modules = useModules()

const createModule = (type: string) =>
  modules.add(type, {
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
