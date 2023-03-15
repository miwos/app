import type { Shape } from '@miwos/shape'
import type { Signal } from './Signal'

export interface ModuleDefinition {
  id: string
  shape: Shape['id']
  clipContent?: boolean
  inputs: { signal: Signal }[]
  outputs: { signal: Signal }[]
  props: Record<string, { type: string; options: Record<string, any> }>
  label?: string | string[]
}

export interface ModuleDefinitionSerialized
  extends Pick<ModuleDefinition, 'id' | 'shape'> {
  label?: string | string[]
  inputs?: Signal[]
  outputs?: Signal[]
  props?: Record<string, [type: string, options: Record<string, any>]>
}
