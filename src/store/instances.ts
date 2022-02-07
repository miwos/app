import { ModuleInstance } from '@/types/ModuleInstance'
import { Point } from '@/types/Point'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useConnections } from './connections'
import { useModules } from './modules'
import { usePatch } from './patch'
import { useShapes } from './shapes'

type ModuleInstanceNormalized = Omit<
  ModuleInstance,
  'module' | 'shape' | 'isFocused'
>

export const useInstances = defineStore({
  id: 'moduleInstances',

  state: () => ({
    items: {} as Record<ModuleInstance['id'], ModuleInstanceNormalized>,
    sortedIds: [] as ModuleInstance['id'][],
    focusedId: null as ModuleInstance['id'] | null,
    // We use a one-based index to be consistent with lua.
    nextId: 1,
  }),

  getters: {
    /** Return an instance with resolved relations */
    get:
      (state) =>
      (id: ModuleInstanceNormalized['id']): ModuleInstance => {
        const instance = state.items[id]
        const module = useModules().get(instance.moduleId)
        const shape = useShapes().get(module.shapeId)
        const isFocused = id === state.focusedId
        return { ...instance, module, shape, isFocused }
      },

    sorted: (state) => state.sortedIds.map((id) => state.items[id]),

    isFocused: (state) => (id: ModuleInstance['id']) =>
      computed(() => state.focusedId === id),
  },

  actions: {
    add(
      moduleId: ModuleInstance['moduleId'],
      position: Point,
      shouldUpdatePatch = true
    ) {
      const module = useModules().get(moduleId)

      const id = this.nextId++
      const propValues = Object.fromEntries(
        Object.entries(module.props).map(([name, prop]) => [
          name,
          prop.default ?? prop.min ?? 0,
        ])
      )

      this.items[id] = {
        id,
        moduleId,
        position,
        propValues,
        activeInputOutputIds: new Set(),
      }
      this.sortedIds.push(id)

      if (shouldUpdatePatch) usePatch().update()
    },

    remove(id: ModuleInstance['id'], shouldUpdatePatch = true) {
      // Remove all connections that are connected to the module we are about
      // to remove.
      const connections = useConnections()
      for (const connection of connections.listConnectedToInstance(id))
        connections.remove(connection.id, false)

      this.sortedIds.splice(this.sortedIds.indexOf(id), 1)
      delete this.items[id]

      if (shouldUpdatePatch) usePatch().update()
    },

    focus(id: ModuleInstance['id'] | null) {
      this.focusedId = id
      if (id) {
        const { sortedIds } = this
        sortedIds.splice(sortedIds.indexOf(id), 1).push(id)
        sortedIds.push(id)
      }
    },

    clear(shouldUpdatePatch = true) {
      this.nextId = 1
      this.items = {}
      if (shouldUpdatePatch) usePatch().update()
    },
  },
})
