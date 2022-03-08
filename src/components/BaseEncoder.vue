<template>
  <button
    class="encoder"
    :class="{ mapped: isMapped, transition: transitionEnabled }"
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
import { useMapping } from '@/stores/mapping'
import { map } from '@/utils'
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  id: number
}>()

const encoder = computed(() => useMapping().currentPage.encoders[props.id])
const isMapped = computed(() => !!encoder.value.mappedTo)
const rotation = computed(() =>
  encoder.value.mappedTo ? map(encoder.value.value, 0, 127, 0, 270) - 135 : 0
)

// Only transition when we are changing the pages.
const transitionEnabled = ref(false)
const currentPageIndex = computed(() => useMapping().currentPageIndex)
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
