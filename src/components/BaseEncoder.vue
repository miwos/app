<template>
  <button
    class="encoder"
    :class="{ mapped: !!encoder, transition: transitionEnabled }"
    @mousedown="isDragging = true"
    @mouseup="isDragging = false"
    ref="el"
  >
    <svg
      class="encoder-icon"
      viewBox="0 0 10 10"
      @transitionend="onTransitionEnd"
    >
      <line class="encoder-dial" x1="5" y1="0" x2="5" y2="2.5" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import svg from '@/assets/knob.svg'
import { useRotation } from '@/composables/useRotation'
import { useEncoders } from '@/stores/encoders'
import { useInstances } from '@/stores/instances'
import { useModules } from '@/stores/modules'
import { map } from '@/utils'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  id: number
}>()

const encoders = useEncoders()
const instances = useInstances()
const modules = useModules()
const encoder = computed(() => encoders.get(props.id))
const isDragging = ref(false)

const el = ref<HTMLElement | null>(null)
const dragRotation = useRotation(el)

const propDefinition = computed(() => {
  if (!encoder.value) return

  const { instanceId, propName } = encoder.value
  const module = modules.getByInstanceId(instanceId)

  return module.props.get(propName)
})

const prop = computed(() => {
  if (!encoder.value) return
  const { instanceId, propName } = encoder.value
  return instances.get(instanceId).props.get(propName)
})

watch(dragRotation, (angle) => {
  if (!propDefinition.value) return
  const { min, max } = propDefinition.value
  angle += 135
  angle = Math.max(Math.min(angle, 270), 0)
  const value = Math.round(map(angle, 0, 270, min ?? 0, max ?? 127))
  updateProp(value)
})

const rotation = computed(() => {
  if (!encoder.value || !prop.value || !propDefinition.value) return 0
  const { min, max } = propDefinition.value
  return map(prop.value.value, min ?? 0, max ?? 127, 0, 270) - 135
})

const updateProp = (value: number) => {
  if (!encoder.value) return
  const { instanceId, propName } = encoder.value
  instances.updateProp(instanceId, propName, value)
}

// ? What exactly does this
// Only transition when we are changing the pages.
const transitionEnabled = ref(false)
const currentPageIndex = computed(() => encoders.currentPageIndex)
watch(currentPageIndex, () => (transitionEnabled.value = true))
const onTransitionEnd = () => (transitionEnabled.value = false)
</script>

<style scoped lang="scss">
@use '@/styles/utilities';

.encoder {
  width: 40px;
  height: 40px;
  border-radius: 50%;

  &-icon {
    overflow: visible;
    width: 100%;
    height: 100%;
    transform: rotate(v-bind('rotation + `deg`'));
  }

  &.transition &-icon {
    transition: transform var(--fade-duration);
  }

  &.mapped {
    background-color: var(--mapping-color);
  }

  &:not(.mapped) {
    @include utilities.glass;
  }

  &-dial {
    stroke: #d5d5d5;
    stroke-width: 3;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }

  &.mapped &-dial {
    stroke: var(--module-outline-color);
  }
}
</style>
