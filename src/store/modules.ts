import { markRaw } from 'vue'
import { defineStore } from 'pinia'
import { replaceIdWithClass } from '../utils'
import { useConnections } from './connections'
import { usePatch } from './patch'

import shapeRound from '../assets/module-shape-round.svg?raw'
import shapeSplit from '../assets/module-shape-split.svg?raw'

const definitionModules = import.meta.globEager('../modules/*.json')
const definitions: Record<string, ModuleDefinition> = Object.fromEntries(
  Object.values(definitionModules).map((module) => [
    module.default.type,
    module.default,
  ])
)

const shapes: Record<string, string> = {
  default: replaceIdWithClass(shapeRound),
  split: replaceIdWithClass(shapeSplit),
}

export const useModules = defineStore({
  id: 'modules',

  state: () => ({
    isInit: false,
    definitions: markRaw(definitions),
    shapes: markRaw(shapes),
    items: {} as Record<number, Module>,
    // We use a one-based index to be consistent with lua.
    nextModuleId: 1,
  }),

  getters: {
    definitionsList: (state) => Object.values(state.definitions),
  },

  actions: {
    init() {
      if (this.isInit) return
      this.addModule('Input', { x: 200, y: 200 }, false)
      this.addModule('Output', { x: 400, y: 400 }, false)
      this.isInit = true
    },

    addDefinition(definition: ModuleDefinition) {
      this.definitions[definition.type] = definition
    },

    addModule(type: string, position: Point, update = true) {
      const definition = this.definitions[type]
      if (!this.definitions[type])
        throw new Error(`Can't find module definition for type '${type}'.`)

      const id = this.nextModuleId++

      const props = {} as Module['props']
      for (const [name, prop] of Object.entries(definition.props ?? {})) {
        props[name] = prop.default ?? prop.min ?? 0
      }

      this.items[id] = {
        id,
        type,
        position,
        inputDeltas: [],
        outputDeltas: [],
        props,
      }

      if (update) usePatch().update()
    },

    removeModule(moduleId: number, update = true) {
      // Remove all connections that are connected to the module we are about
      // to remove.
      const connections = useConnections()
      for (const connection of connections.connectedToModule(moduleId))
        connections.removeConnection(connection.id, false)

      delete this.items[moduleId]
      if (update) usePatch().update()
    },

    clearAll(update = true) {
      this.nextModuleId = 1
      this.items = {}
      if (update) usePatch().update()
    },
  },
})
