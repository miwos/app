export interface Module {
  id: string
  shapeId: string
  props: Record<ModuleProp['type'], ModuleProp>
}

export interface ModuleProp {
  type: string
  default: number
  min?: number
  max?: number
}
