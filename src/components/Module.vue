<template>
  <div
    class="module"
    ref="el"
    :style="style"
    tabindex="-1"
    @keydown.delete="remove"
  >
    <div class="connection-points inputs">
      <ConnectionPoint
        v-for="i in definition.inputs"
        :data-input="i"
        :moduleId="id"
        :index="i"
        type="input"
      />
    </div>
    <div class="connection-points outputs">
      <ConnectionPoint
        v-for="i in definition.outputs"
        :data-output="i"
        :moduleId="id"
        :index="i"
        type="output"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useDragElement } from '../composables/useDragElement'
import { useModules } from '../store/modules'
import { getInputOutputDeltas } from '../utils'
import ConnectionPoint from './ConnectionPoint.vue'

const props = defineProps<{
  id: number
  type: string
  position: Point
}>()

const emit = defineEmits([
  'update:position',
  'update:inputDeltas',
  'update:outputDeltas',
])

const el = ref<HTMLElement | null>(null)
const { position, isDragging } = useDragElement(el)
const modules = useModules()
const definition = modules.definitions[props.type]

watch(position, (position) => emit('update:position', position))
watch(isDragging, (value) => document.body.classList.toggle('dragging', value))

onMounted(() => {
  if (!el.value) return
  // The position of the inputs and outputs relative to the module won't change
  // during runtime, so we measure them once and can then use them to calculate
  // the connection line positions.
  const [inputDeltas, outputDeltas] = getInputOutputDeltas(el.value)
  emit('update:inputDeltas', inputDeltas)
  emit('update:outputDeltas', outputDeltas)
})

const remove = () => modules.removeModule(props.id)

const style = computed(() => ({
  top: `${props.position.y}px`,
  left: `${props.position.x}px`,
}))
</script>

<style scoped>
.module {
  position: absolute;
  background: red;
  width: 100px;
  height: 100px;
}

.module:focus {
  background-color: aqua;
  outline: none;
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
