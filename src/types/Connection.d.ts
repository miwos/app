import type { ShapeConnector } from '@miwos/shape/dist'
import type { ModuleConnector } from './module'
import type Module from './module'
import type { Point } from './Point'
import type { Signal } from './Signal'

export interface Connection {
  id: `${Module['id']},${number}-${Module['id']},${number}`
  from: { moduleId: Module['id']; index: number }
  to: { moduleId: Module['id']; index: number }
}

export type ConnectionSerialized = [
  fromModuleId: Module['id'],
  fromIndex: index,
  toModuleId: Module['id'],
  toIndex: index
]

export interface ConnectionPoint {
  moduleId: Module['id']
  index: number
  direction: 'in' | 'out'
  thru?: boolean
  signal: Signal
  position: Point
}
