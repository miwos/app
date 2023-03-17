import type { Shape, ShapeConnector } from '@miwos/shape'
import type { Point, Size } from './Geometry'
import type { ModuleDefinition } from './ModuleDefinition'
import type { Signal } from './Signal'

export interface Module {
  id: number
  type: ModuleDefinition['id']
  label: string
  position: Point
  size?: Size
  props: Record<string, unknown>
}

export interface ModuleSerialized {
  id: number
  type: ModuleDefinition['id']
  label?: string
  props?: Record<string, unknown>
  position?: [x: number, y: number]
}
