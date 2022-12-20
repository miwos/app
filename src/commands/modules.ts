import { useConnections } from '@/stores/connections'
import { useModules } from '@/stores/modules'
import type { Connection, Module, Optional } from '@/types'
import { pushCommand } from '.'

export const addModule = (module: Optional<Module, 'id' | 'props'>) => {
  const modules = useModules()
  let id: Module['id']

  pushCommand('add module', () => {
    id = modules.add(module).id
    return () => modules.remove(id)
  })
}

export const removeModules = (ids: Set<Module['id']>) => {
  const name = 'remove modules'
  const modules = useModules()
  const connections = useConnections()
  let removed: { module: Module; connections: Connection[] }[] = []

  pushCommand(name, async () => {
    removed = []
    for (const id of ids) {
      const removedItem = await modules.remove(id)
      if (removedItem) removed.push(removedItem)
    }
    return () =>
      removed.forEach((item) => {
        modules.add(item.module)
        item.connections.forEach((connection) => connections.add(connection))
      })
  })
}
