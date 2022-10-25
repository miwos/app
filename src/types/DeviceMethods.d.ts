import type { ConnectionSerialized } from './Connection'
import type { Module } from './Module'

export type DeviceMethods = {
  '/parts/select': (index: number) => boolean

  '/connections/add': (...args: ConnectionSerialized) => void

  '/connections/remove': (...args: ConnectionSerialized) => void

  '/modules/add': (type: Module['type'], id: Module['id']) => void

  '/modules/remove': (id: Module['id']) => void
}
