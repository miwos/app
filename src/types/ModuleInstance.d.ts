import { Module, ModuleInputOutput } from './Module'
import { Point } from './Point'

export interface ModuleInstance {
  id: number
  moduleId: Module['id']
  label: string | string[]
  position: Point
  props: Map<string, any>
  isUpdating: boolean
}

export interface ModuleInstanceSerialized {
  Module: Module['id']
  xy: [x: number, y: number]
  props: Record<string, any>
}
