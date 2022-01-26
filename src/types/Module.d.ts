import { Shape } from 'shape-compiler'

export interface Module {
  id: string
  shapeId: string
  shape: Shape
  component?: string
  props: Record<ModuleProp['type'], ModuleProp>
}

export interface ModuleProp {
  type: string
  default: number
  min?: number
  max?: number
}
