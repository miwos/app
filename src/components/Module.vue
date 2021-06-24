<template>
  <div class="module" ref="el" :style="style">
    <div class="connection-points inputs">
      <ConnectionPoint
        v-for="i in definition.inputs"
        :data-input="i - 1"
        :moduleId="id"
        :index="i - 1"
        type="input"
      />
    </div>
    <div class="connection-points outputs">
      <ConnectionPoint
        v-for="i in definition.outputs"
        :data-output="i - 1"
        :moduleId="id"
        :index="i - 1"
        type="output"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmit, defineProps, onMounted, ref, watch } from 'vue'
import { useDragElement } from '../composables/useDragElement'
import { useModules } from '../store/modules'
import { getOffset } from '../utils'
import ConnectionPoint from './ConnectionPoint.vue'

const props = defineProps<{
  id: number
  type: string
  position: Point
}>()

const emit = defineEmit([
  'update:position',
  'update:inputDeltas',
  'update:outputDeltas',
])

const el = ref<HTMLElement | null>(null)
const { position } = useDragElement(el)
const modules = useModules()
const definition = modules.definitions[props.type]

watch(position, (position) => emit('update:position', position))

onMounted(() => {
  if (!el.value) return

  // The position of the inputs and outputs relative to the module won't change
  // during runtime, so we measure them once and can then use them to calculate
  // the connection line positions.

  const bounds = el.value.getBoundingClientRect()

  const inputElements = Array.from(el.value.querySelectorAll('[data-input]'))
  const inputDeltas = inputElements.map((el) =>
    getOffset(bounds, el.getBoundingClientRect())
  )

  const outputElements = Array.from(el.value.querySelectorAll('[data-output]'))
  const outputDeltas = outputElements.map((el) =>
    getOffset(bounds, el.getBoundingClientRect())
  )

  emit('update:inputDeltas', inputDeltas)
  emit('update:outputDeltas', outputDeltas)
})

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
