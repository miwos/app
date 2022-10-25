import type { ModuleInstance } from './Module'
import type { Signal } from './Signal'

export interface Connection {
  id: `${ConnectionPoint['id']}-${ConnectionPoint['id']}`
  from: ConnectionPoint
  to: ConnectionPoint
}

export interface ConnectionPoint {
  id: `${ModuleInstance['id']},${number}`
  moduleInstanceId: ModuleInstance['id']
  index: number
  direction: 'in' | 'out'
  isInOut?: boolean
  signal: Signal
}

export type ConnectionSerialized = [
  fromModuleInstanceId: ModuleInstance['id'],
  fromIndex: ConnectionPoint['index'],
  toModuleInstanceId: ModuleInstance['id'],
  toIndex: ConnectionPoint['index']
]
