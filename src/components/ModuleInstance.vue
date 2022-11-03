<template>
  <div class="module" ref="el" :class="{ isSelected }">
    <ModuleOutline v-if="shape && isSelected" :module="module" :shape="shape" />
    <ModuleShape v-if="shape" :shape="shape" @mouseup.prevent="focus" />
    <ConnectionPoints :module="module" />
  </div>
</template>

<script setup lang="ts">
import { onMouseUpOutside } from '@/composables/onMouseUpOutside'
import { useDraggable } from '@/composables/useDraggable'
import { useModules } from '@/stores/modules'
import { useModuleShapes } from '@/stores/moduleShapes'
import { useProject } from '@/stores/project'
import type { Module, Point } from '@/types'
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import ConnectionPoints from './ConnectionPoints.vue'
import ModuleOutline from './ModuleOutline.vue'
import ModuleShape from './ModuleShape.vue'

const props = defineProps<{ position: Point; module: Module }>()
const emit = defineEmits<{ (e: 'update:position', position: Point): void }>()

const el = ref<HTMLElement>()
const { position, isDragging } = useDraggable(el)
const { module } = toRefs(props)

const modules = useModules()
const shape = useModuleShapes().getByModule(props.module)
const project = useProject()

const isSelected = computed(() => modules.selectedIds.has(module.value.id))
const focus = () => !isDragging.value && modules.focus(module.value.id)

onMounted(() => {
  if (!el.value) return
  const { width, height } = el.value.getBoundingClientRect()
  props.module.size = { width, height }
})

onMouseUpOutside(el, () => !project.isSelecting && modules.selectedIds.clear())

watch(position, (position) => {
  emit('update:position', position)
  project.save()
})

watch(isDragging, (value) => (modules.isDragging = value))
</script>

<style scoped lang="scss">
.module {
  position: absolute;
  top: v-bind('props.position.y + `px`');
  left: v-bind('props.position.x + `px`');
  pointer-events: none;
}
</style>
