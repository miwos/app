import { Handle } from 'shape-compiler/src'
import { ModuleInstance } from './ModuleInstance'

export interface Connection {
  id: string
  from: ConnectionPoint
  to: ConnectionPoint
}

export interface ConnectionPoint {
  id: Handle['id']
  signal: Handle['signal']
  direction: Handle['direction']
  index: number
  instanceId: ModuleInstance['id']
}
