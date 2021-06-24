<template>
  <div class="module" ref="el" :style="style">
    <div class="connection-points inputs">
      <ConnectionPoint
        v-for="i in definition.inputs"
        :moduleId="id"
        :index="i"
        type="input"
      />
    </div>
    <div class="connection-points outputs">
      <ConnectionPoint
        v-for="i in definition.outputs"
        :moduleId="id"
        :index="i"
        type="output"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmit, defineProps, ref, watch } from 'vue'
import { useDragElement } from '../composables/useDragElement'
import { useModules } from '../store/modules'
import ConnectionPoint from './ConnectionPoint.vue'

// TODO import interface from modules store
interface ModuleDefinition {
  type: string
  inputs: number
  outputs: number
}

const props = defineProps<{
  id: number
  type: string
  position: { x: number; y: number }
  definition: ModuleDefinition
}>()

const emit = defineEmit(['update:position'])

const el = ref<HTMLElement | null>(null)
const { position } = useDragElement(el)
// const modules = useModules()

watch(position, (position) => emit('update:position', position))

const style = computed(() => ({
  top: `${props.position.y}px`,
  left: `${props.position.x}px`,
}))

// const definition = modules.definitions[props.type]
</script>

<style scoped>
.module {
  position: absolute;
  background: red;
  width: 100px;
  height: 100px;
}

.connection-points {
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.outputs {
  bottom: 0;
}
</style>
