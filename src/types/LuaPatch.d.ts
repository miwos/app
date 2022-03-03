import { Module, ModuleInputOutput } from './Module'
import { ModuleInstance } from './ModuleInstance'

export type LuaPatchConnection = [
  fromInstanceId: ModuleInstance['id'],
  fromIndex: ModuleInputOutput['index'],
  toInstanceId: ModuleInstance['id'],
  toIndex: ModuleInputOutput['index']
]

export interface LuaPatchInstance {
  Module: Module['id']
  xy: [x: number, y: number]
  props: ModuleInstance['props']
}

export interface LuaPatchMappingPage {
  encoders: Record<string, [instanceId: ModuleInstance['id'], propName: string]>
}

export interface LuaPatch {
  instances: Record<string, LuaPatchInstance>
  connections: LuaPatchConnection[]
  mapping: LuaPatchMappingPage[]
}
