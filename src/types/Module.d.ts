import type { Shape, ShapeConnector } from '@miwos/shape'
import type { Point, Size } from './Geometry'
import type { ModuleDefinition } from './ModuleDefinition'
import type { Signal } from './Signal'

export interface Module {
  id: number
  definition: ModuleDefinition['id']
  position: Point
  size?: Size
}

export interface ModuleSerialized extends Module {
  position: [x: number, y: number]
}
