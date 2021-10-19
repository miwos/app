import { useConnections } from '../store/connections'
import { useInterfaces } from '../store/interfaces'
import { useModules } from '../store/modules'
// @ts-ignore
import { format } from 'lua-json'

export const createLuaPatch = () => {
  const modules = useModules()
  const connections = useConnections()

  const requiredModules = new Set()
  const types = {} as Record<string, string>

  for (const { id, type } of Object.values(modules.items)) {
    requiredModules.add(type)
    types[`%${id}%`] = `%${type}%`
  }

  const require = Array.from(requiredModules)
    .map((type) => `local ${type} = require('modules.${type}')`)
    .join('\n')

  const patch = {
    types,

    connections: Object.values(connections.items).map(
      ({ from, to }) =>
        `%{ ${from.moduleId}, ${from.index}, ${to.moduleId}, ${to.index} }%`
    ),

    interface: useInterfaces().pages.map((page) =>
      Object.fromEntries(
        Object.entries(page).map(([name, entries]) => [
          name,
          entries.map(
            (entry) => `%{ ${entry.moduleId}, "${entry.propName}" }%`
          ),
        ])
      )
    ),
  }

  // lua-json does a great job, but some things we have to convert manually.
  // Each string that starts and ends with a `%` will be ignored from lua-json
  // and the quotes and the `%` characters removed afterwards.
  const patchLua = format(patch).replace(/('%|%')/g, '')
  return `${require}\n\n${patchLua}`
}
