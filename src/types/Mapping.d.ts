import { ModuleInstance } from './ModuleInstance'

export type Mapping = MappingPage[]

export type Encoder = {
  id: number
  value: number
  mappedTo: { instanceId: ModuleInstance['id']; propName: string } | null
}

export interface MappingPage {
  encoders: Record<Encoder['id'], Encoder>
}
