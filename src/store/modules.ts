import { markRaw, computed } from 'vue'
import { defineStore } from 'pinia'
import { getOutputId, replaceIdWithClass, MidiType } from '../utils'
import { useConnections } from './connections'
import { usePatch } from './patch'

import shapeRound from '../assets/module-shape-round.svg?raw'
import shapeSplit from '../assets/module-shape-split.svg?raw'
import shapeEffect from '../assets/module-shape-effect.svg?raw'
import shapeInput from '../assets/module-shape-input.svg?raw'
import shapeOutput from '../assets/module-shape-output.svg?raw'
import shapeTransform from '../assets/module-shape-transform.svg?raw'

const definitionModules = import.meta.globEager('../modules/*.json')
const definitions: Record<string, ModuleDefinition> = Object.fromEntries(
  Object.values(definitionModules).map((module) => [
    module.default.type,
    { category: 'default', ...module.default },
  ])
)

const shapes: Record<string, string> = {
  default: replaceIdWithClass(shapeRound),
  input: replaceIdWithClass(shapeInput),
  output: replaceIdWithClass(shapeOutput),
  split: replaceIdWithClass(shapeSplit),
  effect: replaceIdWithClass(shapeEffect),
  transform: replaceIdWithClass(shapeTransform),
}

export const useModules = defineStore({
  id: 'modules',

  state: () => ({
    isInit: false,
    isHovering: false,
    definitions: markRaw(definitions),
    shapes: markRaw(shapes),
    items: {} as Record<number, Module>,
    sortedIds: [] as number[],
    focusedModuleId: null as number | null,
    // We use a one-based index to be consistent with lua.
    nextModuleId: 1,
  }),

  getters: {
    list: (state) => Object.values(state.items),

    getItem: (state) => (moduleId: number) => state.items[moduleId],

    getInput: (state) => (moduleId: number, index: number) =>
      state.items[moduleId].inputs[index],

    getOutput: (state) => (moduleId: number, index: number) =>
      state.items[moduleId].outputs[index],

    sorted: (state) => state.sortedIds.map((id) => state.items[id]),

    definitionsList: (state) => Object.values(state.definitions),

    isFocused: (state) => (moduleId: number) =>
      computed(() => state.focusedModuleId === moduleId),
  },

  actions: {
    init() {
      if (this.isInit) return
      this.add('Input', { x: 200, y: 200 }, false)
      this.add('Output', { x: 400, y: 400 }, false)
      this.isInit = true
    },

    focus(moduleId: number | null) {
      this.focusedModuleId = moduleId
      if (moduleId) {
        const { sortedIds } = this
        sortedIds.splice(sortedIds.indexOf(moduleId), 1).push(moduleId)
        sortedIds.push(moduleId)
      }
    },

    addDefinition(definition: ModuleDefinition) {
      this.definitions[definition.type] = definition
    },

    add(type: string, position: Point, update = true) {
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
        inputs: [],
        outputs: [],
        props,
      }
      this.sortedIds.push(id)

      if (update) usePatch().update()
    },

    activateOutput(moduleId: number, index: number, type: MidiType) {
      const output = this.items[moduleId].outputs[index]

      const isNoteOn = type === MidiType.NoteOn
      const isNoteOff = type === MidiType.NoteOff
      if (isNoteOn || isNoteOff) {
        output.isActive = isNoteOn
      }
    },

    remove(moduleId: number, update = true) {
      // Remove all connections that are connected to the module we are about
      // to remove.
      const connections = useConnections()
      for (const connection of connections.connectedToModule(moduleId))
        connections.remove(connection.id, false)

      this.sortedIds.splice(this.sortedIds.indexOf(moduleId), 1)
      delete this.items[moduleId]
      if (update) usePatch().update()
    },

    clear(update = true) {
      this.nextModuleId = 1
      this.items = {}
      if (update) usePatch().update()
    },
  },
})
