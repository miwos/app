import { defineStore } from 'pinia'

export const useModules = defineStore({
  id: 'modules',

  state: () => ({
    definitions: {} as Record<string, ModuleDefinition>,
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
      this.items[id] = { id, type, position }
    },

    clearAll() {
      this.nextModuleId = 0
      this.items = {}
    },
  },
})
