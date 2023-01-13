<template>
  <div class="menu-add" v-if="isOpen" :class="`align-${align}`" ref="el">
    <ModuleDefinitionSearch
      ref="search"
      :align-results="align"
      @select="addModule"
    ></ModuleDefinitionSearch>
  </div>
</template>

<script setup lang="ts">
import * as commands from '@/commands'
import type { ModuleDefinition } from '@/types'
import {
  onClickOutside,
  onKeyDown,
  useMouse,
  useWindowSize,
} from '@vueuse/core'
import { nextTick, ref, watchEffect } from 'vue'
import ModuleDefinitionSearch from './ModuleDefinitionSearch.vue'

const el = ref<HTMLElement>()
const search = ref<InstanceType<typeof ModuleDefinitionSearch>>()
const mouse = useMouse()
const { height: windowHeight } = useWindowSize()
const position = ref({ x: 0, y: 0 })
const isOpen = ref(false)
const align = ref<'top' | 'bottom'>('bottom')
const height = ref(0)

onKeyDown(' ', (e) => e.ctrlKey && open())
onKeyDown('Escape', () => close())
onClickOutside(el, () => close())

watchEffect(() => {
  const itemHeight = 40 // 2.5rem
  const itemPadding = 8 // 0.5rem
  const itemSize = itemHeight + itemPadding

  height.value =
    Math.floor((windowHeight.value * 0.2) / itemSize) * itemSize - itemPadding
})

const open = () => {
  if (isOpen.value) return

  position.value = { x: mouse.x.value, y: mouse.y.value }
  isOpen.value = true

  align.value = position.value.y > window.innerHeight / 2 ? 'top' : 'bottom'

  search.value?.clear()
  nextTick(() => search.value?.focus())
}

const close = () => {
  isOpen.value = false
}

const addModule = (type: ModuleDefinition['id']) => {
  const position = { x: mouse.x.value, y: mouse.y.value }
  commands.addModule({ type, position })
  close()
}
</script>

<style scoped lang="scss">
.menu-add {
  position: absolute;
  z-index: var(--z-menu);
  top: v-bind('position.y + `px`');
  left: v-bind('position.x + `px`');

  max-height: v-bind('height + `px`');
  height: 100%;

  &.align-top {
    transform: translateY(-100%);
  }
}
</style>
