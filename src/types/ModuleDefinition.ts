import type { Shape } from '@miwos/shape'
import type { Signal } from './Signal'

export interface ModuleDefinition {
  id: string
  shape: Shape
  inputs: { signal: Signal }[]
  outputs: { signal: Signal }[]
}

export interface ModuleDefinitionNormalized
  extends Omit<ModuleDefinition, 'shape'> {
  shape: string
}
