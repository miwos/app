import { computed } from 'vue'

export const useOutputPosition = (module: Module, index: number) =>
  computed(() => ({
    x: module.position.x + module.outputDeltas[index].x,
    y: module.position.y + module.outputDeltas[index].y,
  }))
