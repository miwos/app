<template>
  <button
    class="encoder"
    :class="{ mapped: !!encoder, transition: transitionEnabled }"
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
import { useEncoders } from '@/stores/encoders'
import { useInstances } from '@/stores/instances'
import { useModules } from '@/stores/modules'
import { map } from '@/utils'
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  id: number
}>()

const encoders = useEncoders()
const instances = useInstances()
const modules = useModules()
const encoder = computed(() => encoders.get(props.id))

const rotation = computed(() => {
  if (!encoder.value) return 0

  const { instanceId, propName } = encoder.value
  const value = instances.get(instanceId).props.get(propName)
  const module = modules.getByInstanceId(instanceId)

  const prop = module.props.get(propName)
  if (!prop) return

  const { min, max } = prop
  return map(value, min ?? 0, max ?? 127, 0, 270) - 135
})

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
