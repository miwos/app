<template>
  <div ref="el" class="context-menu">
    <BaseMenu v-if="isOpen" :menu="menu" @select="isOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { onMouseDownOutside } from '@/composables/onMouseDownOutside'
import { ref } from 'vue'
import BaseMenu from './BaseMenu.vue'

const el = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const position = ref({ x: 0, y: 0 })

onMouseDownOutside(el, () => (isOpen.value = false))

defineProps<{
  menu: MenuItem[]
}>()

const open = (e: MouseEvent) => {
  if (!el.value) return

  const { x, y } = el.value.parentElement!.getBoundingClientRect()
  const relativePosition = { x: e.x - x, y: e.y - y }

  position.value = relativePosition
  isOpen.value = true
}

defineExpose({ open })
</script>

<style scoped lang="scss">
.context-menu {
  position: absolute;
  top: v-bind('position.y + `px`');
  left: v-bind('position.x + `px`');
}
</style>
