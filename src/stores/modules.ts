import type { Module, ModuleSerialized, Optional, Point, Rect } from '@/types'
import { getCombinedRect } from '@/utils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useConnections } from './connections'
import { useDevice } from './device'
import { useModuleDefinitions } from './moduleDefinitions'
import { useModuleShapes } from './moduleShapes'

type Id = Module['id']

export const serializeModule = (module: Module): ModuleSerialized => ({
  ...module,
  position: [module.position.x, module.position.y],
})

export const deserializeModule = (serialized: ModuleSerialized): Module => ({
  ...serialized,
  position: { x: serialized.position[0], y: serialized.position[1] },
})

export const useModules = defineStore('module-instances', () => {
  const device = useDevice()
  const definitions = useModuleDefinitions()
  const connections = useConnections()
  const shapes = useModuleShapes()

  const items = ref(new Map<Id, Module>())
  const focusedId = ref<Id>()
  const sortedIds = ref<Id[]>([])
  const selectedIds = ref(new Set<Id>())
  const isDragging = ref(false)
  const nextId = ref(1) // We use a one-based index to be consistent with lua.

  // Getters
  const get = (id: Id) => {
    const item = items.value.get(id)
    if (!item) {
      console.warn(`module '${id}' not found`)
      return
    }
    return item
  }

  const getConnector = (id: Id, index: number, direction: 'in' | 'out') => {
    const item = get(id)
    if (!item) return

    const definition = definitions.get(item.definition)
    if (!definition) return

    const definitionConnector = definitions.getConnector(
      item.definition,
      index,
      direction
    )
    const shapeConnector = shapes.getConnector(
      definition.shape,
      index,
      direction
    )

    if (!definitionConnector || !shapeConnector) return
    return { ...definitionConnector, ...shapeConnector }
  }

  const sortIndexes = computed(
    () => new Map(sortedIds.value.map((v, i) => [v, i]))
  )
  const getSortIndex = (id: Id) => sortIndexes.value.get(id)

  const selectedItems = computed(() => {
    const items = new Map<Module['id'], Module>()
    for (const id of selectedIds.value) {
      const item = get(id)
      if (item) items.set(id, item)
    }
    return items
  })

  const focusedItem = computed(() =>
    focusedId.value !== undefined ? get(focusedId.value) : undefined
  )

  // Actions
  const serialize = () => Array.from(items.value.values()).map(serializeModule)

  const deserialize = (serialized: ModuleSerialized[]) => {
    items.value.clear()
    for (const serializedModule of serialized) {
      const module = deserializeModule(serializedModule)
      add(module)
      // Make sure that future module ids won't clash with the currently added
      // module.
      nextId.value = Math.max(nextId.value, module.id + 1)
    }
  }

  const add = (module: Optional<Module, 'id'>, updateDevice = true) => {
    module.id ??= nextId.value++
    items.value.set(module.id, module as Module)
    sortedIds.value.push(module.id)

    if (updateDevice)
      device.update('/e/modules/add', [module.definition, module.id])

    return module as Module
  }

  const remove = (id: Id) => {
    const module = get(id)
    if (!module) return

    const removedConnections = connections.getByModuleId(id)
    removedConnections.forEach(({ id }) => connections.remove(id))

    items.value.delete(id)
    sortedIds.value.splice(sortedIds.value.indexOf(id), 1)

    device.update('/e/modules/remove', [id])
    return { module, connections: removedConnections }
  }

  const focus = (id: Id | undefined) => {
    focusedId.value = id
    if (id === undefined) return
    sortedIds.value.splice(sortedIds.value.indexOf(id), 1).push(id)
    sortedIds.value.push(id)
  }

  const clear = () => {
    items.value.clear()
    sortedIds.value = []
  }

  return {
    items,
    focusedId,
    focusedItem,
    selectedIds,
    selectedItems,
    isDragging,
    serialize,
    deserialize,
    get,
    getConnector,
    getSortIndex,
    add,
    remove,
    focus,
    clear,
  }
})
