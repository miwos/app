import { ShapeInputOutput } from 'shape-compiler/dist'
import { ModuleInputOutput } from './Module'
import { ModuleInstance } from './ModuleInstance'

type InstanceId = ModuleInstance['id']

export interface Connection {
  id: `(${ConnectionPoint['id']})-(${ConnectionPoint['id']})`
  from: ConnectionPoint
  to: ConnectionPoint
}

export interface ConnectionPoint {
  id: `${InstanceId}-${number}`
  direction: 'in' | 'out'
  index: number
  instanceId: ModuleInstance['id']
  isInOut?: ShapeInputOutput['isInOut']
  signal?: ModuleInputOutput['signal']
}

export type ConnectionSerialized = [
  fromInstanceId: ModuleInstance['id'],
  fromIndex: number,
  toInstanceId: ModuleInstance['id'],
  toIndex: number
]
