import { InputOutput, Shape } from 'shape-compiler'
import { Module } from './Module'
import { Point } from './Point'

export interface ModuleInstance {
  id: number
  moduleId: string
  module: Module
  shape: Shape
  isFocused: boolean
  position: Point
  propValues: Record<string, any>
  activeInputOutputIds: Set<InputOutput['id']>
  isUpdating: boolean
}
