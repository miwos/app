<template>
  <div
    class="module"
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
    <ModuleShape :id="shape.id" :templateId="shape.templateId" />
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
import { computed, ref, watchEffect } from 'vue'
import ModuleHandles from './ModuleHandles.vue'
import ModuleProps from './ModuleProps.vue'
import ModuleShape from './ModuleShape.vue'

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

const focus = () => el.value?.focus()
const blur = () => el.value?.blur()
watchEffect(() => (instance.isFocused ? focus() : blur()))
watchEffect(() => emit('update:position', position))
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

.module {
  position: absolute;
  display: flex;
  flex-direction: row;
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
