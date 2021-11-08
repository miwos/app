<template>
  <div class="module" ref="el" tabindex="-1" @keydown.delete="remove">
    <div
      class="svg-container"
      ref="svg"
      v-html="replaceIdWithClass(moduleSvg)"
    ></div>
    <div class="connection-points inputs">
      <ConnectionPoint
        v-for="i in definition.inputs"
        :style="{
          '--x': props.inputDeltas[i - 1]?.x + 'px',
          '--y': props.inputDeltas[i - 1]?.y + 'px',
        }"
        :data-input="i"
        :moduleId="id"
        :index="i"
        type="input"
      />
    </div>
    <!-- <div class="props">
      <ModuleProp
        v-for="(prop, name) in definition.props"
        :name="name"
        :prop="prop"
        :value="modules.items[id].props[name]"
        :encoder="interfaces.getEncoderId(id, name).value"
        @update:encoder="interfaces.mapEncoder($event, id, name)"
        @update:value="sendPropValue(name, $event)"
      />
    </div> -->
    <div class="connection-points outputs">
      <ConnectionPoint
        v-for="i in definition.outputs"
        :style="{
          '--x': props.outputDeltas[i - 1]?.x + 'px',
          '--y': props.outputDeltas[i - 1]?.y + 'px',
        }"
        :data-output="i"
        :moduleId="id"
        :index="i"
        type="output"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import moduleSvg from '../assets/Module-Round.svg?raw'

import { onMounted, ref, watch } from 'vue'
import { useBridge } from '../bridge'
import { useDragElement } from '../composables/useDragElement'
import { useInterfaces } from '../store/interfaces'
import { useModules } from '../store/modules'
import { getInputOutputDeltas, replaceIdWithClass } from '../utils'
import ConnectionPoint from './ConnectionPoint.vue'
import ModuleProp from './ModuleProp.vue'

const props = defineProps<{
  id: number
  type: string
  position: Point
  inputDeltas: Array<{ x: number; y: number }>
  outputDeltas: Array<{ x: number; y: number }>
}>()

const emit = defineEmits([
  'update:position',
  'update:inputDeltas',
  'update:outputDeltas',
])

const el = ref<HTMLElement | null>(null)
const svg = ref<HTMLElement | null>(null)
const { position, isDragging } = useDragElement(el)
const bridge = useBridge()
const modules = useModules()
const interfaces = useInterfaces()
const definition = modules.definitions[props.type]

watch(position, (position) => emit('update:position', position))
watch(isDragging, (value) => document.body.classList.toggle('dragging', value))

onMounted(() => {
  if (!svg.value) return
  // The position of the inputs and outputs relative to the module won't change
  // during runtime, so we measure them once and can then use them to calculate
  // the connection line positions.
  const [inputDeltas, outputDeltas] = getInputOutputDeltas(svg.value)
  emit('update:inputDeltas', inputDeltas)
  emit('update:outputDeltas', outputDeltas)
  svg.value.querySelectorAll('.input, .output').forEach((el) => el.remove())
})

const sendPropValue = (name: string, value: number) => {
  bridge.sendProp(props.id, name, value)
}

const remove = (event: KeyboardEvent) => {
  if (event.target === el.value) modules.removeModule(props.id)
}
</script>

<style lang="scss" scoped>
.svg-container:deep(svg) {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;

  * {
    vector-effect: non-scaling-stroke;
    stroke-width: 1px;
  }

  // .input {
  //   display: none;
  // }
  // .output {
  //   display: none;
  // }
}

.module {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100px;
  top: v-bind('props.position.y + `px`');
  left: v-bind('props.position.x + `px`');
}

.module:focus {
  &:deep(svg .background) {
    fill: antiquewhite;
  }
  outline: none;
}

.props {
  transform: translate(100%);
}

.connection-points {
  /* position: absolute; */
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.outputs {
  bottom: 0;
}
</style>
