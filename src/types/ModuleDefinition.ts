import type { Shape } from '@miwos/shape'
import type { Signal } from './Signal'

export interface ModuleDefinition {
  id: string
  shape: Shape['id']
  inputs: { signal: Signal }[]
  outputs: { signal: Signal }[]
  props: Record<string, { type: string; options: Record<string, any> }>
}

export interface ModuleDefinitionSerialized
  extends Pick<ModuleDefinition, 'id' | 'shape'> {
  inputs?: Signal[]
  outputs?: Signal[]
  props?: Record<string, [type: string, options: Record<string, any>]>
}
