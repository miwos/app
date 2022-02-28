<template>
  <div
    class="module-instance"
    :class.camel="{
      dragging: isDragging,
      focused: isFocused,
      clipping: !isInputOrOutput,
      updating: isUpdating,
    }"
    ref="el"
    tabindex="0"
    @keydown.delete="remove"
  >
    <ShapePath ref="shape" />
    <ShapeMask :id="maskId" />
    <div
      class="module-content"
      ref="content"
      @contextmenu.prevent="onContextMenu"
    >
      <ModuleContent />
    </div>
    <ShapeOutline />
    <ModuleInputsOutputs />
    <ModuleProps />
    <BaseContextMenu ref="contextMenu" :menu="contextActions" />
  </div>
</template>

<script setup lang="ts">
import { onMouseDownOutside } from '@/composables/onMouseDownOutside'
import { useDragElement } from '@/composables/useDragElement'
import { useInstances } from '@/store/instances'
import { Point } from '@/types/Point'
import { provide, ref, watch } from 'vue'
import ModuleInputsOutputs from './ModuleInputsOutputs.vue'
import ModuleProps from './ModuleProps.vue'
import ShapeMask from './ShapeMask.vue'
import ShapeOutline from './ShapeOutline.vue'
import ShapePath from './ShapePath.vue'
import ModuleContent from './ModuleContent.vue'
import { useEditor } from '@/store/editor'
import { throttle } from '@/utils'
import BaseContextMenu from './BaseContextMenu.vue'

const props = defineProps<{
  id: number
  position: Point
  propValues: Record<string, any>
}>()

const emit = defineEmits(['update:position'])

const el = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const contextMenu = ref<InstanceType<typeof BaseContextMenu> | null>(null)
const { position, isDragging } = useDragElement(content)
const instances = useInstances()
const editor = useEditor()
const instance = instances.get(props.id)
const isFocused = instances.isFocused(props.id)
const shape = instance.shape
const module = instance.module
const maskId = `instance-${props.id}-mask`
const isInputOrOutput = module.id === 'Input' || module.id === 'Output'
const isUpdating = ref(false)

provide('instance', instance)
provide('shape', shape)
provide('module', module)

watch(position, () => emit('update:position', position))
onMouseDownOutside(el, () => instances.focus(null))

const onContextMenu = (e: MouseEvent) => contextMenu.value?.open(e)

const editModule = async () => {
  await editor.enable()
  editor.open(`lua/modules/${module.id}.lua`)
}
const forkModule = () => {}

const contextActions = [
  { name: 'Fork', action: forkModule },
  { name: 'Edit original', action: editModule },
]

watch(
  () => instances.items[props.id]?.isUpdating,
  throttle((v: boolean) => {
    isUpdating.value = v
  }, 150)
)

const remove = (event: KeyboardEvent) => {
  if (event.target === el.value) instances.remove(props.id)
}
</script>

<style lang="scss" scoped>
.module {
  &-instance {
    position: absolute;
    top: v-bind('props.position.y + `px`');
    left: v-bind('props.position.x + `px`');

    transition: opacity 150ms ease-out;
    &.updating {
      opacity: 0.5;
    }
  }

  &-props {
    justify-content: center;
    gap: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  &-content {
    pointer-events: all;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .clipping &-content {
    clip-path: v-bind('`url(#` + maskId + `)`');
  }
}

.shape {
  &-mask,
  &-outline {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
  }

  &-path {
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

  &-outline {
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
}

@keyframes fade-in-out {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
