import { defineStore } from 'pinia'

const definitionModules = import.meta.globEager('../modules/*.json')
const definitions: Record<string, ModuleDefinition> = Object.fromEntries(
  Object.values(definitionModules).map((module) => [
    module.default.type,
    module.default,
  ])
)

export const useModules = defineStore({
  id: 'modules',

  state: () => ({
    definitions,
    items: {} as Record<number, Module>,
    nextModuleId: 0,
  }),

  actions: {
    addDefinition(definition: ModuleDefinition) {
      this.definitions[definition.type] = definition
    },

    addModule(type: string, position: Point) {
      if (!this.definitions[type])
        throw new Error(`Can't find module definition for type '${type}'.`)
      const id = this.nextModuleId++
      this.items[id] = { id, type, position, inputDeltas: [], outputDeltas: [] }
    },

    clearAll() {
      this.nextModuleId = 0
      this.items = {}
    },
  },
})
