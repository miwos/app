import type { ConnectionSerialized } from './Connection'
import type { MappingPageSerialized } from './Mapping'
import type { ModuleSerialized } from './Module'

export interface ProjectSerialized {
  connections: ConnectionSerialized[]
  modules: ModuleSerialized[]
  mappings: Record<number, MappingPageSerialized>
}
