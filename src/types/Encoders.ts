import { ModuleInstance } from './ModuleInstance'

export type Encoder = {
  id: number
  instanceId: ModuleInstance['id']
  propName: string
}

export type EncoderPage = Map<Encoder['id'], Encoder>

export type EncoderSerialized = [
  instanceId: ModuleInstance['id'],
  propName: string
]

export type EncoderPageSerialized = Record<Encoder['id'], EncoderSerialized>
