<template>
  <div class="menu-module-search" v-if="isOpen" ref="el">
    <input
      ref="input"
      placeholder="Search..."
      @input="search(($event.target as any).value)"
    />
    <div class="menu-module-search-results">
      <div
        v-for="(module, index) in searchResults"
        class="result"
        :key="module.id"
        @click="createInstance(module.id)"
      >
        <ModuleShape class="result-shape" :id="module.shapeId" />
        <div class="result-name">{{ module.id }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModuleInstances } from '@/store/moduleInstances'
import { useModules } from '@/store/modules'
import { Module } from '@/types/Module'
import { useMagicKeys, onClickOutside, useMouse } from '@vueuse/core'
import { nextTick, ref, watch } from 'vue'
import ModuleShape from './ModuleShape.vue'

const el = ref<HTMLElement | null>()
const input = ref<HTMLElement | null>()

const { space, escape } = useMagicKeys()
const mouse = useMouse()
const modules = useModules()
const instances = useModuleInstances()

const isOpen = ref(false)
const position = ref({ x: 0, y: 0 })
const searchResults = ref<Module[]>()

watch(space, () => open())
watch(escape, () => close())
onClickOutside(el, () => close())

const open = async () => {
  if (isOpen.value) return

  // Break reactivity, because we don't want the menu to move while it's open.
  position.value = { x: mouse.x.value, y: mouse.y.value }
  isOpen.value = true

  await nextTick()
  input.value?.focus()
}

const close = () => {
  isOpen.value = false
}

const search = (pattern: string) => {
  searchResults.value = modules.search(pattern)
}

const createInstance = (moduleId: Module['id']) => {
  instances.add(moduleId, position.value)
  close()
}
</script>

<style scoped lang="scss">
.menu-module-search {
  position: absolute;
  top: v-bind('position.y + `px`');
  left: v-bind('position.x + `px`');

  &-results {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.result {
  display: flex;
  align-items: center;
  gap: 0.5em;

  &-shape:deep(svg) {
    width: 2rem;
    .outline {
      display: none;
    }
    .shape {
      fill: var(--module-outline-color);
    }
  }
}
</style>
