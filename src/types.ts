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

interface Module {
  id: number
  type: string
  position: Point
  inputDeltas: Point[]
  outputDeltas: Point[]
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
