import { defineStore } from 'pinia'
import { compileShape, Shape } from 'shape-compiler'
import { reactive, toRefs } from 'vue'

const shapeImports = import.meta.globEager('../assets/shapes/*.svg')
const shapes = new Map<Shape['id'], Shape>(
  Object.entries(shapeImports).map(([path, module]) => {
    const id = path.match(/\/([^/]+)\.(.+)$/)![1]
    return [id, compileShape(module.default, id)]
  })
)

export const useShapes = defineStore('shapes', () => {
  const state = reactive({
    items: shapes,
  })

  // Getters
  const get = (id: Shape['id']) => {
    const shape = state.items.get(id)
    if (!shape) throw new Error(`Couldn't find shape with id '${id}'`)
    return shape
  }

  return { ...toRefs(state), get }
})
