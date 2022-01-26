import { Handle } from 'shape-compiler/src'
import { Module } from './Module'
import { Point } from './Point'

export interface ModuleInstance {
  id: number
  moduleId: string
  module: Module
  position: Point
  propValues: Record<string, any>
  activeHandleIds: Set<Handle['id']>
}
