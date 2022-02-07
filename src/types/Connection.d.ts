import { InputOutput } from 'shape-compiler'
import { ModuleInstance } from './ModuleInstance'

export interface Connection {
  id: string
  from: ConnectionPoint
  to: ConnectionPoint
}

export interface ConnectionPoint {
  id: InputOutput['id']
  signal: InputOutput['signal']
  direction: InputOutput['direction']
  index: number
  instanceId: ModuleInstance['id']
}
