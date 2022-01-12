import { defineStore } from 'pinia'

export interface ShapeHandle {
  type: 'input' | 'output' | 'transform'
  angle: number
  delta: Point
}

export interface ShapeHandles {
  input: ShapeHandle[]
  output: ShapeHandle[]
  transform: ShapeHandle[]
}

export interface Shape {
  type: string
  svg: string
  templateId: string
  handles: ShapeHandles
}

const shapeImports = import.meta.globEager('../assets/module-shape-*.svg')
const shapes: Record<Shape['type'], Shape> = Object.fromEntries(
  Object.entries(shapeImports).map(([path, module]) => {
    const type = path.match(/module-shape-(.+)\.svg/)![1]
    return [
      type,
      {
        type,
        templateId: `template-module-shape-${type}`,
        svg: module.default,
        handles: {
          input: [],
          output: [],
          transform: [],
        },
      },
    ]
  })
)

export const useShapes = defineStore({
  id: 'shapes',

  state: () => ({
    items: shapes,
  }),

  getters: {
    find: (state) => (type: Shape['type']) => state.items[type],
  },
})
