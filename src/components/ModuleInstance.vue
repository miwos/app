<template>
  <div class="module" ref="el" :class="{ isSelected }">
    <component
      class="module-custom-component"
      v-if="customComponent"
      :is="customComponent"
    />
    <template v-else>
      <ModuleMask v-if="shape" :shape="shape" :id="maskId" />
      <ModuleOutline
        v-if="shape && isSelected"
        :module="module"
        :shape="shape"
      />
      <ModuleShape v-if="shape" :shape="shape" />
      <ModuleContent :module="module" :mask="`url(#${maskId})`" />
      <ModuleLabel :module="module" :shape="shape" />
      <ConnectionPoints :module="module" />
      <ModuleProps :module="module" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMouseUpOutside } from '@/composables/onMouseUpOutside'
import { useDraggable } from '@/composables/useDraggable'
import { useModules } from '@/stores/modules'
import { useModuleShapes } from '@/stores/moduleShapes'
import { useProject } from '@/stores/project'
import type { Module, Point } from '@/types'
import {
  computed,
  defineAsyncComponent,
  onMounted,
  ref,
  toRefs,
  watch,
} from 'vue'
import ConnectionPoints from './ConnectionPoints.vue'
import ModuleOutline from './ModuleOutline.vue'
import ModuleShape from './ModuleShape.vue'
import { useModulesDrag } from '@/composables/useModulesDrag'
import ModuleProps from './ModuleProps.vue'
import ModuleContent from './ModuleContent.vue'
import ModuleMask from './ModuleMask.vue'
import ModuleLabel from './ModuleLabel.vue'

const moduleComponentsImport = import.meta.glob([
  '../modules/*.vue',
  '!**/*.story.vue',
])

const moduleComponents = new Map(
  Object.entries(moduleComponentsImport).map(([path, asyncModule]) => {
    const name = path.match(/\/([\w_-]+).vue$/)![1]
    return [name, defineAsyncComponent(asyncModule as any)]
  })
)

const props = defineProps<{ position: Point; module: Module }>()

const el = ref<HTMLElement>()
const modules = useModules()
const shape = useModuleShapes().getByModule(props.module)
const project = useProject()
const maskId = `module-${props.module.id}-mask`
const customComponent = moduleComponents.get(props.module.type)

const isSelected = computed(() => modules.selectedIds.has(props.module.id))
const focus = () => {
  if (!modules.selectedItems.size) modules.focus(props.module.id)
}

const select = () => {
  if (modules.isDragging) return
  modules.selectedIds.clear()
  modules.selectedIds.add(props.module.id)
  modules.focus(props.module.id)
}

onMounted(() => {
  if (!el.value) return
  const { width, height } = el.value.getBoundingClientRect()
  props.module.size = { width, height }
})

onMouseUpOutside(el, () => {
  if (!modules.isDragging && !project.isSelecting) modules.selectedIds.clear()
})

useModulesDrag(el, props.module)

watch(
  () => props.position,
  () => project.save()
)

// watch(isDragging, (value) => (modules.isDragging = value))
</script>

<style scoped lang="scss">
.module {
  position: absolute;
  top: v-bind('props.position.y + `px`');
  left: v-bind('props.position.x + `px`');
  pointer-events: none;

  &-custom-component {
    pointer-events: all;
  }
}
</style>
