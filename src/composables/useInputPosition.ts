import { computed } from '@vue/runtime-core'

export const useInputPosition = (module: Module, index: number) =>
  computed(() => ({
    // Index is one-based to be consistent with lua so we have to decrease it.
    x: module.position.x + module.inputDeltas[index - 1].x,
    y: module.position.y + module.inputDeltas[index - 1].y,
  }))
