import { useConnections } from '../store/connections'
import { useInterface } from '../store/interface'
import { useModules } from '../store/modules'

const patchTemplate = (
  require: string,
  types: string,
  connections: string,
  interfaces: string
) =>
  `${require ? require + '\n\n' : ''}return {
  types = {
${types}
  },

  connections = {
${connections}
  },

  interface = {
${interfaces}    
  }
}
`

export const createLuaPatch = () => {
  const modules = useModules()
  const connections = useConnections()

  const require = new Set()
  const types = []

  for (const { id, type } of Object.values(modules.items)) {
    require.add(type)
    types.push([id, type])
  }

  const requireMarkup = Array.from(require)
    .map((type) => `local ${type} = require('modules.${type}')`)
    .join('\n')

  const typesMarkup = types
    .map(([id, type]) => `    [${id}] = ${type}`)
    .join(',\n')

  const connectionsMarkup = Object.values(connections.items)
    .map(
      ({ from, to }) =>
        `    { ${from.moduleId}, ${from.index}, ${to.moduleId}, ${to.index} }`
    )
    .join(',\n')

  const interfaceMarkup = useInterface()
    .pages.map((page) =>
      Object.entries(page).map(
        ([name, entries]) =>
          `    {\n      ${name} = {\n${entries
            .map(
              (entry) => `        { ${entry.moduleId}, '${entry.propName}' }`
            )
            .join(',\n')}\n      }\n    }`
      )
    )
    .join(',\n')

  return patchTemplate(
    requireMarkup,
    typesMarkup,
    connectionsMarkup,
    interfaceMarkup
  )
}
