import type { ConnectionSerialized } from './Connection'
import type { Module } from './Module'

export type DeviceMethods = {
  '/e/parts/select': (index: number) => boolean

  '/e/connections/add': (...args: ConnectionSerialized) => void

  '/e/connections/remove': (...args: ConnectionSerialized) => void

  '/e/modules/add': (id: Module['id'], type: Module['type']) => void

  '/e/modules/remove': (id: Module['id']) => void
}
