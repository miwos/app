export interface Module {
  id: string
  shapeId: string
  component?: string
  label?: string | string[]
  props: Map<string, ModuleProp>
  inputs: ModuleInputOutput[]
  outputs: ModuleInputOutput[]
}

export interface ModuleProp {
  name: string
  type: string
  index: number
  default: number
  list?: boolean
  min?: number
  max?: number
  step?: number
}

export interface ModuleInputOutput {
  signal: 'midi' | 'trigger'
}

export type ModuleInfo = Pick<
  Module,
  'shapeId' | 'label' | 'props' | 'inputs' | 'outputs'
>

export interface ModuleInputOutputSerialized {
  signal: number
}

export interface ModuleInfoSerialized {
  shape: Module['shapeId']
  label?: string | string[]
  inputs?: ModuleInputOutputSerialized[]
  outputs?: ModuleInputOutputSerialized[]
  props: ModuleProp[]
}
