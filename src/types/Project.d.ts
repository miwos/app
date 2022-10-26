import type { ConnectionSerialized } from './Connection'
import type { ModuleSerialized } from './Module'

export interface ProjectSerialized {
  connections: ConnectionSerialized[]
  modules: ModuleSerialized[]
}
