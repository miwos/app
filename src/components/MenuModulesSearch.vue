<template>
  <BaseMenu class="menu-modules-search" v-if="isOpen" ref="el">
    <input
      class="search-input glass pill"
      ref="input"
      placeholder="Search..."
      spellcheck="false"
      value=""
      @input="search(($event.target as any).value)"
    />
    <ModulesSelect
      v-if="results.length"
      class="search-results"
      :modules="results"
      @update:value="createInstance($event)"
    />
  </BaseMenu>
</template>

<script setup lang="ts">
import { useInstances } from '@/store/instances'
import { useModules } from '@/store/modules'
import { Module } from '@/types/Module'
import { onClickOutside, onKeyDown, useMouse } from '@vueuse/core'
import { ref } from 'vue'
import BaseMenu from './BaseMenu.vue'
import ModulesSelect from './ModulesSelect.vue'

const mouse = useMouse()
const instances = useInstances()
const modules = useModules()
const el = ref<HTMLElement | null>()
const input = ref<HTMLInputElement | null>()
const isOpen = ref(false)
const position = ref({ x: 0, y: 0 })
const results = ref<Module[]>([])

onKeyDown(' ', () => open())
onKeyDown('Escape', () => close())
onClickOutside(el, () => close())

const open = async () => {
  if (isOpen.value) return
  // Break reactivity, because we don't want the menu to move while it's open.
  position.value = { x: mouse.x.value, y: mouse.y.value }
  isOpen.value = true

  // Somehow focusing the input after a `nextTick()` won't display the
  // placeholder. With `setTimeout()` it works though...
  setTimeout(() => input.value?.focus())
}

const close = () => {
  isOpen.value = false
  results.value = []
}

const search = (pattern: string) => {
  results.value = modules.search(pattern)
}

const createInstance = (moduleId: Module['id']) => {
  instances.add(moduleId, position.value)
  close()
}
</script>

<style scoped lang="scss">
.menu-modules-search {
  position: absolute;
  top: v-bind('position.y + `px`');
  left: v-bind('position.x + `px`');
}

.search-input {
  padding: 0 1em;
  &::placeholder {
    font-weight: 400;
    // A sightly lighter color than the default placeholder.
    color: #a1a1a1;
  }
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-left: 1.5rem;
}
</style>
