import type { Shape, ShapeConnector } from '@miwos/shape'
import type { ModuleDefinition } from './ModuleDefinition'
import type { Point } from './Point'
import type { Signal } from './Signal'

export interface Module {
  id: number
  definition: ModuleDefinition['id']
  position: Point
}

export interface ModuleSerialized extends Module {
  position: [x: number, y: number]
}
