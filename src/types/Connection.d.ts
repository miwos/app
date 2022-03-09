import { ShapeInputOutput } from 'shape-compiler/dist'
import { ModuleInputOutput } from './Module'
import { ModuleInstance } from './ModuleInstance'

type InstanceId = ModuleInstance['id']
type index = ConnectionPoint['index']

export interface Connection {
  id: `(${InstanceId},${index})-(${InstanceId},${index})`
  from: ConnectionPoint
  to: ConnectionPoint
}

export interface ConnectionPoint
  extends Pick<ModuleInputOutput, 'id' | 'index' | 'direction'> {
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
