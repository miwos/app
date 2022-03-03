import type { ShapeInputOutput } from 'shape-compiler'

export interface Module {
  id: string
  shapeId: string
  component?: string
  props: Record<ModuleProp['type'], ModuleProp>
  inputsOutputs: Record<ModuleInputOutput['id'], ModuleInputOutput>
}

export interface ModuleProp {
  type: string
  default: number
  show: boolean
  min?: number
  max?: number
  step?: number
}

export interface ModuleInputOutput {
  id: ShapeInputOutput['id']
  index: number
  direction: 'in' | 'out'
  signal: 'midi' | 'trigger'
}
