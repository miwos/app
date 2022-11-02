import type { Shape } from '@miwos/shape'
import type { Signal } from './Signal'

export interface ModuleDefinition {
  id: string
  shape: Shape['id']
  inputs: { signal: Signal }[]
  outputs: { signal: Signal }[]
}
