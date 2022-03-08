import { ModuleInstance } from './ModuleInstance'

export type Mapping = MappingPage[]

export type Encoder = {
  id: number
  value: number
  mappedTo?: { instanceId: ModuleInstance['id']; propName: string }
}

export interface MappingPage {
  encoders: Map<Encoder['id'], Encoder>
}
