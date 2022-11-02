import { useModules } from '@/stores/modules'
import type { Module, Optional } from '@/types'
import { pushCommand } from '.'

export const addModule = (module: Optional<Module, 'id'>) => {
  const modules = useModules()
  let id: Module['id']

  pushCommand('add module', () => {
    id = modules.add(module).id
    return () => modules.remove(id)
  })
}

export const removeModule = (id: Module['id']) => {
  const name = 'remove module'
  const modules = useModules()
  let removed: Module | undefined

  pushCommand(name, () => {
    removed = modules.remove(id)
    return () => {
      if (!removed)
        return console.warn(`failed to undo '${name}': module doesn't exist`)
      modules.add(removed)
    }
  })
}
