<template>
  <div class="menu-modules-search" v-show="isOpen" ref="el">
    <input
      class="search-input"
      ref="input"
      placeholder="Search..."
      spellcheck="false"
      value=""
      @input="search(($event.target as any).value)"
    />
    <ModulesSelect
      v-if="isOpen"
      class="search-results"
      :modules="results"
      @update:value="createInstance"
    />
  </div>
</template>

<script setup lang="ts">
import { useInstances } from '@/stores/instances'
import { useModules } from '@/stores/modules'
import { Module } from '@/types/Module'
import { onClickOutside, onKeyDown, useMouse } from '@vueuse/core'
import { ref } from 'vue'
import ModulesSelect from './ModulesSelect.vue'

const mouse = useMouse()
const instances = useInstances()
const modules = useModules()
const el = ref<HTMLElement | null>()
const input = ref<HTMLInputElement | null>()
const isOpen = ref(false)
const position = ref({ x: 0, y: 0 })
const results = ref<Module[]>([])

onKeyDown(' ', (e) => e.ctrlKey && open())
onKeyDown('Escape', () => close())
onClickOutside(el, () => close())

const open = () => {
  if (isOpen.value) return
  // Break reactivity, because we don't want the menu to move while it's open.
  position.value = { x: mouse.x.value, y: mouse.y.value }
  input.value && (input.value.value = '')
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

const createInstance = async (moduleId: Module['id']) => {
  instances.add(moduleId, position.value)
  close()
}
</script>

<style scoped lang="scss">
@use '@/styles/utilities';

.menu-modules-search {
  @include utilities.menu;
  position: absolute;
  top: v-bind('position.y + `px`');
  left: v-bind('position.x + `px`');
  z-index: var(--z-modal);
}

.search-input {
  @include utilities.glass;
  @include utilities.pill;
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
