import type { ConnectionSerialized } from './Connection'
import type { Module } from './Module'
import type { ModuleDefinitionSerialized } from './ModuleDefinition'

export type DeviceMethods = {
  '/e/parts/select': (index: number) => boolean

  '/e/connections/add': (...args: ConnectionSerialized) => void

  '/e/connections/remove': (...args: ConnectionSerialized) => void

  '/e/modules/add': (id: Module['id'], type: Module['type']) => void

  '/e/modules/remove': (id: Module['id']) => void

  '/e/modules/prop': (id: Module['id'], name: string, value: unknown) => boolean

  '/e/patch/clear': () => boolean

  '/e/modules/definitions': () => string
}
