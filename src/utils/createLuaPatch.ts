import { useConnections } from '../store/connections'
import { useMapping } from '../store/mapping'
// @ts-ignore
import { format } from 'lua-json'
import { useModuleInstances } from '@/store/moduleInstances'

export const createLuaPatch = () => {
  const requiredModules = new Set()
  const instances = {} as Record<string, string>

  for (const { id, moduleId } of Object.values(useModuleInstances().items)) {
    requiredModules.add(moduleId)
    instances[`%${id}%`] = `%{ Module = ${moduleId} }%`
  }

  const require = Array.from(requiredModules)
    .map((type) => `local ${type} = require('modules.${type}')`)
    .join('\n')

  const patch = {
    instances,

    connections: Object.values(useConnections().items).map(
      ({ from, to }) =>
        `%{ ${from.instanceId}, ${from.index}, ${to.instanceId}, ${to.index} }%`
    ),

    mapping: useMapping().pages.map((page) =>
      Object.fromEntries(
        Object.entries(page).map(([name, entries]) => [
          name,
          Object.fromEntries(
            Object.values(entries).map((entry) => [
              `%${entry.id}%`,
              `%{ ${entry.instanceId}, "${entry.propName}" }%`,
            ])
          ),
        ])
      )
    ),
  }

  // lua-json does a great job, but some things we have to convert manually.
  // Each string that starts and ends with a `%` will be ignored from lua-json
  // and the quotes and the `%` characters removed afterwards.
  const patchLua = format(patch).replace(/('%|%')/g, '')

  console.log(`${require}\n\n${patchLua}`)

  return `${require}\n\n${patchLua}`
}
