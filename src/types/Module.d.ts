import type { ModuleDefinition } from './ModuleDefinition'
import type { Point } from './Point'
import type { Signal } from './Signal'

export interface Module {
  id: number
  type: ModuleDefinition['id']
  position: Point
}

export interface ModuleDefinition {
  id: string
  inputs: ModuleInput[]
  outputs: ModuleOutput[]
}

export interface ModuleInput {
  signal: Signal
}

export interface ModuleOutput {
  signal: Signal
}
