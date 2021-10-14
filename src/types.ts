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
}

interface ModuleProp {
  type: string
}

interface ModuleDefinition {
  type: string
  inputs: number
  outputs: number
  props: Record<string, ModuleProp>
  allowCreate: boolean
  allowRemove: boolean
}
