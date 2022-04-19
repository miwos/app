<template>
  <div class="menu-modules-search" v-show="isOpen" ref="el">
    <div class="search-field">
      <input
        class="search-input"
        ref="input"
        placeholder="Search…"
        spellcheck="false"
        :value="pattern"
        @input="search(($event.target as any).value)"
      />
      <button class="search-all" @click="showAll">All</button>
    </div>

    <ModulesSelect
      v-if="isOpen"
      class="search-results"
      :class="{ 'align-above': shouldAlignAbove }"
      :modules="results"
      @update:value="handleModuleSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { createInstance } from '@/commands'
import { useModules } from '@/stores/modules'
import { Module } from '@/types/Module'
import { onClickOutside, onKeyDown, useMouse } from '@vueuse/core'
import { ref } from 'vue'
import ModulesSelect from './ModulesSelect.vue'

const mouse = useMouse()
const modules = useModules()
const el = ref<HTMLElement | null>()
const input = ref<HTMLInputElement | null>()
const isOpen = ref(false)
const position = ref({ x: 0, y: 0 })
const results = ref<Module[]>([])
const shouldAlignAbove = ref(false)
const maxHeight = ref(0)
const pattern = ref('')

onKeyDown(' ', (e) => e.ctrlKey && open())
onKeyDown('Escape', () => close())
onClickOutside(el, () => close())

const open = () => {
  if (isOpen.value) return
  // Break reactivity, because we don't want the menu to move while it's open.
  position.value = { x: mouse.x.value, y: mouse.y.value }
  shouldAlignAbove.value = position.value.y > window.innerHeight / 2
  pattern.value = ''
  isOpen.value = true

  // Round max height so the last visible item doesn't get clipped.
  const itemHeight = 40 // 2.5rem
  const padding = 8 // 0.5rem
  maxHeight.value =
    Math.floor((window.innerHeight * 0.4) / (itemHeight + padding)) *
      (itemHeight + padding) -
    padding

  // Somehow focusing the input after a `nextTick()` won't display the
  // placeholder. With `setTimeout()` it works though...
  setTimeout(() => input.value?.focus())
}

const close = () => {
  isOpen.value = false
  results.value = []
}

const search = (string: string) => {
  pattern.value = string
  // results.value = Array.from(modules.items.values())
  results.value = modules.search(string)
}

const showAll = () => {
  pattern.value = ''
  results.value = Array.from(modules.items.values())
}

const handleModuleSelect = (moduleId: Module['id']) => {
  createInstance(moduleId, position.value)
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

.search-field {
  @include utilities.glass;
  @include utilities.pill;
  padding: 0 1em;

  &::placeholder {
    font-weight: 400;
    // A sightly lighter color than the default placeholder.
    color: #a1a1a1;
  }
}

.search-all,
.search-input::placeholder {
  font-weight: 400;
  // A sightly lighter color than the default placeholder.
  color: #a1a1a1;
}

.search-all {
  cursor: pointer;
}

.chevron {
  fill: none;
  stroke: var(--module-);
  stroke-width: 1px;
  vector-effect: non-scaling-stroke;
  overflow: visible;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-left: 1.5rem;

  max-height: v-bind('maxHeight + `px`');
  overflow-y: auto;

  &.align-above {
    margin-top: 0;
    // height (2.5rem) + gap (0.5rem)
    transform: translateY(calc(-100% - 2.5rem - 0.5rem));
  }
}
</style>
