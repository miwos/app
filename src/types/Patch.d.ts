import { ConnectionSerialized } from './Connection'
import { EncoderPageSerialized } from './Encoders'
import { ModuleInstance, ModuleInstanceSerialized } from './ModuleInstance'

export interface PatchSerialized {
  instances: Record<ModuleInstance['id'], ModuleInstanceSerialized>
  connections: ConnectionSerialized[]
  encoders: EncoderPageSerialized[]
}
