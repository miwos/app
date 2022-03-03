import { useInstances } from '@/store/instances'
// @ts-ignore
import { format } from 'lua-json'
import { useConnections } from '../store/connections'
import { useMapping } from '../store/mapping'

export const create = () => {
  const requiredModules = new Set()
  const instances: Record<string, object> = {}

  for (const instance of Object.values(useInstances().items)) {
    const { id, moduleId, props, position } = instance
    const xy = `%{ ${position.x}, ${position.y} }%`
    requiredModules.add(moduleId)
    instances[`%${id}%`] = { Module: `%${moduleId}%`, xy, props }
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
            Object.values(entries)
              .filter((v) => v.mappedTo)
              .map((v) => [
                `%${v.id}%`,
                `%{ ${v.mappedTo!.instanceId}, "${v.mappedTo!.propName}" }%`,
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

  // console.log(`${require}\n\n${patchLua}`)

  return `${require}\n\n${patchLua}`
}
