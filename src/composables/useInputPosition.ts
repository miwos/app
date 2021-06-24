import { computed } from '@vue/runtime-core'

export const useInputPosition = (module: Module, index: number) =>
  computed(() => ({
    x: module.position.x + module.inputDeltas[index].x,
    y: module.position.y + module.inputDeltas[index].y,
  }))
