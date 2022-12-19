import type { Shape, ShapeConnector } from '@miwos/shape'
import type { Point, Size } from './Geometry'
import type { ModuleDefinition } from './ModuleDefinition'
import type { Signal } from './Signal'

export interface Module {
  id: number
  type: ModuleDefinition['id']
  position: Point
  size?: Size
}

export interface ModuleSerialized extends Pick<Module, 'id' | 'type'> {
  props?: Record<string, number>
  position?: [x: number, y: number]
}
