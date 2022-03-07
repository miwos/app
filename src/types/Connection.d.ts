import { ModuleInputOutput } from './Module'
import { ModuleInstance } from './ModuleInstance'

export interface Connection {
  id: string
  from: ConnectionPoint
  to: ConnectionPoint
}

export interface ConnectionPoint extends ModuleInputOutput {
  instanceId: ModuleInstance['id']
  isInOut?: boolean
}
