import { ModuleInputOutput } from './Module'
import { Point } from './Point'

export interface ModuleInstance {
  id: number
  moduleId: string
  position: Point
  props: Map<string, any>
  activeInputOutputIds: Set<ModuleInputOutput['id']>
  isUpdating: boolean
}
