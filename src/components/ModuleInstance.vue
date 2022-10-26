<template>
  <div class="module-instance" ref="el">
    {{ module.type }}
    <ConnectionPoint v-for="point in connectionPoints" :point="point" />
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '@/composables/useDraggable'
import { useModuleDefinitions } from '@/stores/moduleDefinitions'
import { useProject } from '@/stores/project'
import type {
  Module,
  Point,
  ConnectionPoint as TConnectionPoint,
  ModuleInput,
  ModuleOutput,
} from '@/types'
import { computed, ref, toRefs, watch } from 'vue'
import ConnectionPoint from './ConnectionPoint.vue'

const props = defineProps<{ position: Point; module: Module }>()
const emit = defineEmits<{ (e: 'update:position', position: Point): void }>()

const el = ref<HTMLElement>()
const { position } = useDraggable(el)
const { module } = toRefs(props)
const definition = useModuleDefinitions().items.get(module.value.type)
const project = useProject()

const connectionPoints = computed((): TConnectionPoint[] => {
  if (!definition) return []

  const toPoint = (
    inputOutput: ModuleInput | ModuleOutput,
    index: number,
    direction: 'in' | 'out'
  ) => ({
    ...inputOutput,
    moduleId: module.value.id,
    index,
    direction,
  })

  return [
    ...definition.inputs.map((input, i) => toPoint(input, i + 1, 'in')),
    ...definition.outputs.map((output, i) => toPoint(output, i + 1, 'in')),
  ]
})

watch(position, (position) => {
  emit('update:position', position)
  project.save()
})
</script>

<style scoped lang="scss">
.module-instance {
  position: absolute;
  top: v-bind('props.position.y + `px`');
  left: v-bind('props.position.x + `px`');
  height: 100px;
  width: 100px;
}
</style>
