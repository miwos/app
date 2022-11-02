import type { Shape, ShapeConnector } from '@miwos/shape'
import type { ModuleDefinition } from './ModuleDefinition'
import type { Point } from './Point'
import type { Signal } from './Signal'

export interface Module {
  id: number
  definition: ModuleDefinition
  position: Point
}

export interface ModuleNormalized extends Omit<Module, 'definition'> {
  definition: ModuleDefinition['id']
}

export interface ModuleSerialized extends ModuleNormalized {
  position: [x: number, y: number]
}
