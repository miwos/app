import { useBridge } from '@/services/bridge'
import { ModuleInstance } from '@/types/ModuleInstance'
import { Point } from '@/types/Point'

import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useConnections } from './connections'
import { useMapping } from './mapping'
import { useModules } from './modules'
import { usePatch } from './patch'
import { useShapes } from './shapes'

type ModuleInstanceNormalized = Omit<
  ModuleInstance,
  'module' | 'shape' | 'isFocused'
>

const debounce = (callback: Function, wait: number) => {
  let timeout: number | undefined
  return (...args: any[]) => {
    const next = () => callback(...args)
    window.clearTimeout(timeout)
    timeout = window.setTimeout(next, wait)
  }
}

const updatePatchDebounced = debounce(() => {
  usePatch().update()
}, 1000)

export const useInstances = defineStore('instances', {
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

    list: (state) => Object.values(state.items),

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
        isUpdating: false,
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

      // Remove all encoders that were mapped to the instance.
      const mapping = useMapping()
      for (const page of mapping.pages) {
        for (const encoder of Object.values(page.encoders)) {
          if (encoder.mappedTo && encoder.mappedTo.instanceId === id) {
            mapping.clearEncoder(encoder.id)
          }
        }
      }

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

    setProp(id: ModuleInstance['id'], name: string, value: number) {
      this.items[id].propValues[name] = value
      useBridge().sendProp(id, name, value)
      // Setting a prop can happen many times per second, so we use a debounced
      // patch update.
      updatePatchDebounced()
    },

    clear(shouldUpdatePatch = true) {
      this.nextId = 1
      this.items = {}
      if (shouldUpdatePatch) usePatch().update()
    },
  },
})
