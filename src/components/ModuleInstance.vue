<template>
  <div class="module" ref="el">
    <div class="module-shape" v-html="shape?.path"></div>
    <ConnectionPoints :module="module" />
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '@/composables/useDraggable'
import { useModuleShapes } from '@/stores/moduleShapes'
import { useProject } from '@/stores/project'
import type { Module, Point } from '@/types'
import { ref, toRefs, watch } from 'vue'
import ConnectionPoints from './ConnectionPoints.vue'

const props = defineProps<{ position: Point; module: Module }>()
const emit = defineEmits<{ (e: 'update:position', position: Point): void }>()

const el = ref<HTMLElement>()
const { position } = useDraggable(el)
const { module } = toRefs(props)

const shape = useModuleShapes().getByModule(props.module)
const project = useProject()

watch(position, (position) => {
  emit('update:position', position)
  project.save()
})
</script>

<style scoped lang="scss">
.module {
  position: absolute;
  top: v-bind('props.position.y + `px`');
  left: v-bind('props.position.x + `px`');
  height: 100px;
  width: 100px;

  &-shape {
    fill: var(--color-module-bg);
  }
}
</style>
