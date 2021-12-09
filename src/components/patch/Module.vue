<template>
  <div
    class="module"
    :class="{ 'drop-target': isDropTarget, dragging }"
    ref="el"
    tabindex="-1"
    @mouseenter="toggleBodyHover(true)"
    @mouseleave="toggleBodyHover(false)"
    @focus="modules.focus(props.id)"
    @blur="modules.focus(null)"
    @dragover="isDropTarget = true"
    @dragleave="isDropTarget = false"
    @keydown.delete="remove"
  >
    <div
      class="svg-container"
      ref="svgContainer"
      v-html="modules.shapes[props.category]"
    ></div>
    <div class="connection-points inputs">
      <ConnectionPoint
        v-for="i in definition.inputs"
        :style="{
          '--x': props.inputs[i - 1]?.delta.x + 'px',
          '--y': props.inputs[i - 1]?.delta.y + 'px',
        }"
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
        :encoder="interfaces.getEncoderId(id, name).value"
        @update:encoder="interfaces.mapEncoder($event, id, name)"
        @update:value="sendPropValue(name, $event)"
      />
    </div>
    <div class="connection-points outputs">
      <ConnectionPoint
        v-for="i in definition.outputs"
        :style="{
          '--x': props.outputs[i - 1]?.delta.x + 'px',
          '--y': props.outputs[i - 1]?.delta.y + 'px',
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
import { onMounted, ref, watchEffect } from 'vue'
import { useBridge } from '@/bridge'
import { useDragElement } from '@/composables/useDragElement'
import { useInterfaces } from '@/store/interfaces'
import { useModules } from '@/store/modules'
import { getInputOutputInformation } from '@/utils'
import ConnectionPoint from './ConnectionPoint.vue'
import ModuleProp from './ModuleProp.vue'

const props = defineProps<{
  id: number
  type: string
  category: string
  position: Point
  inputs: ModuleInput[]
  outputs: ModuleOutput[]
}>()

const emit = defineEmits(['update:position', 'update:inputs', 'update:outputs'])

const el = ref<HTMLElement | null>(null)
const svgContainer = ref<HTMLElement | null>(null)
const { position, isDragging: dragging } = useDragElement(el)
const bridge = useBridge()
const modules = useModules()
const interfaces = useInterfaces()
const definition = modules.definitions[props.type]
const isDropTarget = ref(false)
const focused = modules.isFocused(props.id)

const focus = () => el.value?.focus()
const blur = () => el.value?.blur()
watchEffect(() => (focused.value ? focus() : blur()))
watchEffect(() => emit('update:position', position))
watchEffect(() => document.body.classList.toggle('dragging', dragging.value))

const toggleBodyHover = (state: boolean) =>
  document.body.classList.toggle('module-hover', state)

const scaleModuleShape = (shape: SVGElement) => {
  const width = shape.getAttribute('width')
  if (width) {
    const rems = parseInt(width) / 16
    shape.style.width = `${rems * 0.35}rem`
  }
}

onMounted(async () => {
  const svg = svgContainer.value?.querySelector('svg')
  if (!svg) return

  scaleModuleShape(svg)

  const [inputs, outputs] = getInputOutputInformation(svg)
  emit('update:inputs', inputs)
  emit('update:outputs', outputs)

  svg
    .querySelectorAll('[class^="input"], [class^="output"]')
    .forEach((el) => el.remove())
})

const sendPropValue = (name: string, value: number) => {
  bridge.sendProp(props.id, name, value)
}

const remove = (event: KeyboardEvent) => {
  console.log('remove')
  if (event.target === el.value) modules.remove(props.id)
}
</script>

<style lang="scss" scoped>
.svg-container:deep(svg) {
  display: block;
  overflow: visible;
  height: auto;

  .outline {
    stroke: var(--module-stroke-color);
  }

  .background {
    fill: var(--module-fill-color);
  }

  * {
    vector-effect: non-scaling-stroke;
    stroke-width: 1px;
  }
}

// .module.drop-target,
// .module:hover {
//   .connection-point {
//     z-index: 1;
//   }
// }

.module {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100px;
  top: v-bind('props.position.y + `px`');
  left: v-bind('props.position.x + `px`');
}

.module.drop-target {
  .inputs {
    z-index: 2;
  }
}

.module:focus {
  z-index: var(--z-focused-module);
  &:deep(svg .background) {
    fill: var(--module-focused-fill-color);
  }
  &:deep(svg .outline) {
    stroke: var(--module-focused-stroke-color);
  }
}

.props {
  transform: translate(150%);
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
