import { defineStore } from 'pinia'
import { compileShape, Shape } from 'shape-compiler/src'

const shapeImports = import.meta.globEager('../assets/shapes/*.svg')
const shapes: Record<Shape['id'], Shape> = Object.fromEntries(
  Object.entries(shapeImports).map(([path, module]) => {
    const id = path.match(/\/([^/]+)\.(.+)$/)![1]
    return [id, compileShape(module.default, id)]
  })
)

export const useShapes = defineStore('shapes', {
  state: () => ({
    items: shapes,
  }),

  getters: {
    get: (state) => (id: Shape['id']) => {
      const shape = state.items[id]
      if (!shape) throw new Error(`Couldn't find shape '${id}'`)
      return shape
    },
  },
})
