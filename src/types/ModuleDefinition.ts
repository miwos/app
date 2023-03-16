import type { Shape } from '@miwos/shape'
import type { Signal } from './Signal'

export interface ModuleDefinition {
  id: string
  label?: string | string[]
  shape: Shape['id']
  clipContent: boolean
  inputs: { signal: Signal }[]
  outputs: { signal: Signal }[]
  props: Record<string, { type: string; options: Record<string, any> }>
}

export interface ModuleDefinitionSerialized {
  id: string
  label?: string | string[]
  shape: Shape['id']
  clipContent?: boolean
  inputs?: Signal[]
  outputs?: Signal[]
  props?: Record<string, [type: string, options: Record<string, any>]>
}
