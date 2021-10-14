<template>
  <div class="module" ref="el" tabindex="-1" @keydown.delete="remove">
    <div class="connection-points inputs">
      <ConnectionPoint
        v-for="i in definition.inputs"
        :data-input="i"
        :moduleId="id"
        :index="i"
        type="input"
      />
    </div>
    <div class="props">
      <ModuleProp
        v-for="(prop, name) in definition.props"
        :name="name"
        :prop="prop"
        :value="modules.items[id].props[name]"
        @update:value="sendPropValue(name, $event)"
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
import { onMounted, ref, watch } from 'vue'
import { useBridge } from '../bridge'
import { useDragElement } from '../composables/useDragElement'
import { useModules } from '../store/modules'
import { getInputOutputDeltas } from '../utils'
import ConnectionPoint from './ConnectionPoint.vue'
import ModuleProp from './ModuleProp.vue'

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
const bridge = useBridge()
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

const sendPropValue = (name: string, value: number) => {
  bridge.sendProp(props.id, name, value)
}

const remove = (event: KeyboardEvent) => {
  if (event.target === el.value) modules.removeModule(props.id)
}
</script>

<style scoped>
.module {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: red;
  width: 50px;
  top: v-bind('props.position.y + `px`');
  left: v-bind('props.position.x + `px`');
}

.module:focus {
  background-color: tomato;
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
