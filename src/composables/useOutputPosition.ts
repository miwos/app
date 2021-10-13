import { computed } from 'vue'

export const useOutputPosition = (module: Module, index: number) =>
  computed(() => ({
    // Index is one-based to be consistent with lua so we have to decrease it.
    x: module.position.x + module.outputDeltas[index - 1].x,
    y: module.position.y + module.outputDeltas[index - 1].y,
  }))
