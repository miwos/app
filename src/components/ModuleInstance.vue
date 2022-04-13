<template>
  <div
    class="module-instance"
    :class="{
      dragging: isDragging,
      focused: isFocused,
      clipping: !isInputOrOutput,
      updating: isUpdating,
    }"
    ref="el"
    tabindex="-1"
    @keydown.delete="remove"
  >
    <ShapePath />
    <ShapeMask :id="maskId" />
    <div
      class="module-content"
      ref="content"
      @contextmenu.prevent="onContextMenu"
      @mouseup="test"
    >
      <ModuleContent />
    </div>
    <ShapeOutline />
    <ModuleLabel v-if="module.label" />
    <ModuleInputsOutputs />
    <ModuleProps />
    <BaseContextMenu ref="contextMenu" :menu="contextActions" />
  </div>
</template>

<script setup lang="ts">
import { onMouseDownOutside } from '@/composables/onMouseDownOutside'
import { useDragElement } from '@/composables/useDragElement'
import { useEditor } from '@/stores/editor'
import { useInstances } from '@/stores/instances'
import { useModules } from '@/stores/modules'
import { usePatch } from '@/stores/patch'
import { useShapes } from '@/stores/shapes'
import { ModuleInstance } from '@/types/ModuleInstance'
import { Point } from '@/types/Point'
import { throttle } from '@/utils'
import { computed, provide, ref, toRefs, watch } from 'vue'
import BaseContextMenu from './BaseContextMenu.vue'
import ModuleContent from './ModuleContent.vue'
import ModuleInputsOutputs from './ModuleInputsOutputs.vue'
import ModuleLabel from './ModuleLabel.vue'
import ModuleProps from './ModuleProps.vue'
import ShapeMask from './ShapeMask.vue'
import ShapePath from './ShapePath.vue'
import ShapeOutline from './ShapeOutline.vue'
import { removeInstance } from '@/commands'

const props = defineProps<{
  position: Point
  instance: ModuleInstance
}>()
const { instance } = toRefs(props)

const emit = defineEmits(['update:position'])

const test = () => {
  if (!isDragging.value) {
    instances.focus(instance.value.id)
  }
}

const el = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const contextMenu = ref<InstanceType<typeof BaseContextMenu> | null>(null)

const { position, isDragging } = useDragElement(content)
const instances = useInstances()
const modules = useModules()
const shapes = useShapes()
const editor = useEditor()
const patch = usePatch()

const module = computed(() => modules.get(instance.value.moduleId))
const shape = computed(() => shapes.get(module.value.shapeId))

const maskId = `instance-${instance.value.id}-mask`
const isFocused = instances.isFocused(instance.value.id)
const isUpdating = ref(false)
const isInputOrOutput = computed(
  () => module.value.id === 'Input' || module.value.id === 'Output'
)

provide('instance', instance)
provide('shape', shape)
provide('module', module)

watch(position, () => emit('update:position', position))
watch(isDragging, (v) => !v && patch.save())

onMouseDownOutside(el, () => instances.focus(null))

const onContextMenu = (e: MouseEvent) => contextMenu.value?.open(e)

const edit = () => editor.openModule(module.value.id)

const contextActions = [{ name: 'Edit', action: edit }]

watch(
  () => instance.value.isUpdating,
  throttle((v: boolean) => {
    isUpdating.value = v
  }, 150)
)

const remove = (event: KeyboardEvent) => {
  if (event.target === el.value && isFocused.value)
    removeInstance(instance.value.id)
}
</script>

<style lang="scss" scoped>
.module {
  &-instance {
    position: absolute;
    top: v-bind('props.position.y + `px`');
    left: v-bind('props.position.x + `px`');
    outline: none;

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
  }

  &-outline {
    overflow: visible;
    fill: none;
    stroke: hsl(0deg 0% 32% / 23%);
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
