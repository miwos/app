import type Module from 'module'
import type { Point } from './Point'

export interface ModuleInstance {
  id: number
  moduleId: Module['id']
  position: Point
}
