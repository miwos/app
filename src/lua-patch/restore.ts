import { useConnections } from '@/stores/connections'
import { useInstances } from '@/stores/instances'
import { useModules } from '@/stores/modules'
import { ConnectionPoint } from '@/types/Connection'
import { LuaPatch } from '@/types/LuaPatch'
import { ModuleInputOutput } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'

const deserializeConnectionPoint = (
  instanceId: ModuleInstance['id'],
  index: ModuleInputOutput['index'],
  direction: ModuleInputOutput['direction']
): ConnectionPoint => {
  const id = `${direction}-${index}` as ModuleInputOutput['id']
  const module = useModules().getByInstanceId(instanceId)
  const signal = module.inputsOutputs[id].signal
  return { id, index, instanceId, direction, signal, isInOut: false }
}

/**
 * Deserialize a patch from a lua file and restore it.
 */
export const restore = (patch: LuaPatch) => {
  const instances = useInstances()
  for (const [id, instance] of Object.entries(patch.instances)) {
    const [x, y] = instance.xy
    instances.restore(+id, instance.Module, { x, y }, instance.props)
  }

  const connections = useConnections()
  for (const connection of patch.connections) {
    const [fromId, fromIndex, toId, toIndex] = connection
    const from = deserializeConnectionPoint(fromId, fromIndex, 'out')
    const to = deserializeConnectionPoint(toId, toIndex, 'in')
    connections.add(from, to, false)
  }
}
