export interface Module {
  id: string
  shapeId: string
  component?: string
  props: Map<string, ModuleProp>
  inputs: ModuleInputOutput[]
  outputs: ModuleInputOutput[]
}

export interface ModuleProp {
  name: string
  type: string
  index: number
  default: number
  show: boolean
  min?: number
  max?: number
  step?: number
}

export interface ModuleInputOutput {
  signal: 'midi' | 'trigger'
}

export type ModuleInfo = Pick<
  Module,
  'shapeId' | 'props' | 'inputs' | 'outputs'
>

export interface ModuleInputOutputSerialized {
  signal: number
}

export interface ModuleInfoSerialized {
  shape: Module['shapeId']
  // An array for inputs and outputs would be better but `utils#tableToJson()`
  // lua helper can't handle arrays right now.
  inputs?: Record<number, ModuleInputOutputSerialized>
  outputs?: Record<number, ModuleInputOutputSerialized>
  props: ModuleProp[]
}
