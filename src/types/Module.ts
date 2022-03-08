import type { Shape, ShapeInputOutput } from 'shape-compiler'

export interface Module {
  id: string
  shapeId: string
  component?: string
  props: Map<string, ModuleProp>
  inputsOutputs: Map<ModuleInputOutput['id'], ModuleInputOutput>
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

export interface ModuleInfoJson {
  shape: Module['shapeId']
  props: Record<string, ModuleProp>
  inputsOutputs: Record<ModuleInputOutput['id'], ModuleInputOutput>
}

export type ModuleInfo = Pick<Module, 'shapeId' | 'props' | 'inputsOutputs'>
