<template>
  <div
    class="module-instance"
    :class.camel="{
      dragging: isDragging,
      focused: isFocused,
    }"
    ref="el"
    tabindex="0"
    @keydown.delete="remove"
  >
    <ShapePath :shape="shape" @mousedown="instances.focus(id)" />
    <ShapeMask :shape="shape" :id="maskId" />
    <ShapeOutline :shape="shape" />
    <ModuleInputsOutputs
      :inputsOutputs="shape.inputsOutputs"
      :instanceId="props.id"
    />
    <ModuleProps
      v-if="shape.props"
      :props="instance.module.props"
      :values="instance.propValues"
      :positions="shape.props"
      :instanceId="id"
    />
  </div>
</template>

<script setup lang="ts">
import { onMouseDownOutside } from '@/composables/onMouseDownOutside'
import { useDragElement } from '@/composables/useDragElement'
import { useInstances } from '@/store/instances'
import { Point } from '@/types/Point'
import { computed, ref, watch } from 'vue'
import ModuleInputsOutputs from './ModuleInputsOutputs.vue'
import ModuleProps from './ModuleProps.vue'
import ShapeMask from './ShapeMask.vue'
import ShapeOutline from './ShapeOutline.vue'
import ShapePath from './ShapePath.vue'

const props = defineProps<{
  id: number
  position: Point
  propValues: Record<string, any>
}>()

const emit = defineEmits(['update:position'])

const el = ref<HTMLElement | null>(null)
const { position, isDragging } = useDragElement(el)
const instances = useInstances()
const instance = instances.get(props.id)
const isFocused = instances.isFocused(props.id)
const shape = computed(() => instance.shape)
const maskId = `instance-${props.id}-mask`

watch(position, () => emit('update:position', position))
onMouseDownOutside(el, () => instances.focus(null))

const remove = (event: KeyboardEvent) => {
  if (event.target === el.value) instances.remove(props.id)
}
</script>

<style lang="scss" scoped>
.module-instance {
  position: absolute;
  display: flex;
  flex-direction: row;
  top: v-bind('props.position.y + `px`');
  left: v-bind('props.position.x + `px`');
}

.module-props {
  justify-content: center;
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
}

.shape-mask,
.shape-outline {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
}

.shape-path {
  // Make sure the module is only focusable when clicking ist shape.
  pointer-events: none;
  &:deep(path) {
    pointer-events: all;
  }

  fill: var(--module-shape-color);

  .focused & {
    fill: var(--module-focused-shape-color);
  }
}

.shape-outline {
  overflow: visible;
  fill: none;
  stroke: var(--module-outline-color);
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;

  .focused & {
    stroke: var(--module-focused-outline-color);
  }
}
</style>
