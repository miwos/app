import { Handle } from 'shape-compiler/src'

export interface ModuleInstance {
  id: number
  moduleId: string
  position: Point
  propValues: Record<string, any>
  activeHandleIds: Set<Handle['id']>
}
