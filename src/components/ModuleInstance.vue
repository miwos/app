<template>
  <div
    class="module-instance"
    :class="{ 'drop-target': isDropTarget, dragging: isDragging }"
    ref="el"
    tabindex="-1"
    @mouseenter="toggleBodyHover(true)"
    @mouseleave="toggleBodyHover(false)"
    @focus="instances.focus(props.id)"
    @blur="instances.focus(null)"
    @dragover="isDropTarget = true"
    @dragleave="isDropTarget = false"
    @keydown.delete="remove"
  >
    <ShapeViewBox class="module-path" :shape="shape">
      <g v-html="shape.path"></g>
      <clipPath :id="clipPathId" v-html="shape.path" />
    </ShapeViewBox>
    <ShapeViewBox
      class="module-outline"
      :shape="shape"
      v-html="shape.outline"
    ></ShapeViewBox>
    <ModuleHandles :handles="shape.handles" :instanceId="props.id" />
    <ModuleProps
      :props="instance.module.props"
      :values="instance.propValues"
      :instanceId="id"
    />
  </div>
</template>

<script setup lang="ts">
import { useDragElement } from '@/composables/useDragElement'
import { useModuleInstances } from '@/store/moduleInstances'
import { Point } from '@/types/Point'
import { computed, ref, watch, watchEffect } from 'vue'
import ModuleHandles from './ModuleHandles.vue'
import ModuleProps from './ModuleProps.vue'
import ShapeViewBox from './ShapeViewBox.vue'

const props = defineProps<{
  id: number
  position: Point
  propValues: Record<string, any>
}>()

const emit = defineEmits(['update:position'])

const el = ref<HTMLElement | null>(null)
const { position, isDragging } = useDragElement(el)

const instances = useModuleInstances()
const instance = instances.find(props.id)
const shape = computed(() => instance.shape)
const isDropTarget = ref(false)
const clipPathId = computed(() => `clip-path-${props.id}`)

const focus = () => el.value?.focus()
const blur = () => el.value?.blur()

watch(position, () => emit('update:position', position))
watchEffect(() => (instance.isFocused ? focus() : blur()))
watchEffect(() => document.body.classList.toggle('dragging', isDragging.value))

const toggleBodyHover = (state: boolean) =>
  document.body.classList.toggle('module-hover', state)

const remove = (event: KeyboardEvent) => {
  if (event.target === el.value) instances.remove(props.id)
}
</script>

<style lang="scss" scoped>
.props {
  justify-content: center;
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
}

.module-instance {
  position: absolute;
  display: flex;
  flex-direction: row;
  top: v-bind('props.position.y + `px`');
  left: v-bind('props.position.x + `px`');

  .fu {
    clip-path: v-bind('`url(#${clipPathId})`');
  }

  &:focus {
    z-index: var(--z-focused-module);

    &:deep(svg) {
      .outline {
        stroke: var(--module-focused-outline-color);
      }

      .shape {
        fill: var(--module-focused-shape-color);
      }
    }
  }
}

.module-path {
  fill: var(--module-shape-color);
}

.module-outline {
  position: absolute;
  top: 0;
  left: 0;
  overflow: visible;
  fill: none;
  stroke: var(--module-outline-color);
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  z-index: var(--z-outline);
}

.module-clip-path {
  position: absolute;
}

.connection-points {
  /* position: absolute; */
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
