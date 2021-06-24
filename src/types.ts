type Point = { x: number; y: number }

type ConnectionPointType = 'input' | 'output'

interface ConnectionPoint {
  moduleId: number
  index: number
  type: ConnectionPointType
}

interface Connection {
  from: ConnectionPoint
  to: ConnectionPoint
}

interface Module {
  id: number
  type: string
  position: Point
  inputDeltas: Point[]
  outputDeltas: Point[]
}

interface ModuleDefinition {
  type: string
  inputs: number
  outputs: number
}
