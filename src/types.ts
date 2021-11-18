type Point = { x: number; y: number }

type ConnectionPointType = 'input' | 'output'

interface ConnectionPoint {
  moduleId: number
  index: number
  type: ConnectionPointType
}

interface Connection {
  id: string
  from: ConnectionPoint
  to: ConnectionPoint
}

interface ModuleInput {
  delta: Point
  angle: number
}

type ModuleOutput = ModuleInput

interface Module {
  id: number
  type: string
  position: Point
  inputs: ModuleInput[]
  outputs: ModuleOutput[]
  props: Record<string, number>
}

interface ModuleProp {
  type: string
  default: number
  min?: number
  max?: number
}

interface ModuleDefinition {
  type: string
  category: string
  inputs: number
  outputs: number
  props: Record<string, ModuleProp>
}

interface InterfacePage {
  encoders: Array<{ moduleId: number; propName: string }>
}
