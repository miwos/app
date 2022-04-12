import { useConnections } from '@/stores/connections'
import { useInstances } from '@/stores/instances'
import { usePatch } from '@/stores/patch'
import { Module } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { Point } from '@/types/Point'
import { pushCommand } from './'

export const createInstance = (moduleId: Module['id'], position: Point) => {
  const instances = useInstances()
  let id: ModuleInstance['id'] | undefined
  let removed: ReturnType<typeof instances.remove> | undefined

  pushCommand('create instance', () => {
    if (removed) {
      id && restoreRemoved(id, removed)
    } else {
      id = instances.add(moduleId, position)
    }

    return () => id && (removed = instances.remove(id))
  })
}

export const removeInstance = (id: ModuleInstance['id']) => {
  const instances = useInstances()
  let removed: ReturnType<typeof instances.remove>

  pushCommand('remove instance', () => {
    removed = instances.remove(id)
    return () => restoreRemoved(id, removed)
  })
}

// TODO: fix types for `removed`
const restoreRemoved = (id: ModuleInstance['id'], removed: any) => {
  const instances = useInstances()
  const connections = useConnections()
  const patch = usePatch()

  instances.restore(id, removed.instance, false)
  removed.connections.forEach((v: any) => connections.restore(v), false)
  patch.update()
}
