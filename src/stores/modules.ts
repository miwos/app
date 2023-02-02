import { useBridge } from '@/bridge'
import type { Module, ModuleSerialized, Optional, Point, Rect } from '@/types'
import { getCombinedRect, unpackBytes } from '@/utils'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, nextTick, ref } from 'vue'
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
  props: serialized.props ?? {},
  position: {
    x: serialized.position?.[0] ?? 0,
    y: serialized.position?.[1] ?? 0,
  },
})

export const useModules = defineStore('module-instances', () => {
  const device = useDevice()
  const definitions = useModuleDefinitions()
  const connections = useConnections()
  const shapes = useModuleShapes()
  const bridge = useBridge()

  const items = ref(new Map<Id, Module>())
  const focusedId = ref<Id>()
  const sortedIds = ref<Id[]>([])
  const selectedIds = ref(new Set<Id>())
  const isDragging = ref(false)
  const nextId = ref(1) // We use a one-based index to be consistent with lua.
  const activeInputIds = ref(new Set<number>())
  const activeOutputIds = ref(new Set<number>())

  bridge.on('/e/modules/prop', ({ args: [id, name, value] }) => {
    const item = get(id)
    if (!item) return
    item.props[name] = value
  })

  bridge.on('/e/modules/active-outputs', ({ args }) => {
    activeOutputIds.value = new Set(
      args.map((packed: number) => {
        const [moduleId, index] = unpackBytes(packed)
        return `${moduleId}-${index - 1}` // use zero-based index
      })
    )

    activeInputIds.value.clear()
    connections.activeIds.clear()

    if (activeOutputIds.value.size) {
      for (const { id, from, to } of connections.items.values()) {
        if (activeOutputIds.value.has(from.moduleId)) {
          activeInputIds.value.add(to.moduleId)
          connections.activeIds.add(id)
        }
      }
    }
  })

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

    const definition = definitions.get(item.type)
    if (!definition) return

    const definitionConnector = definitions.getConnector(
      item.type,
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
      add(module, false)
      // Make sure that future module ids won't clash with the currently added
      // module.
      nextId.value = Math.max(nextId.value, module.id + 1)
    }
  }

  const add = (
    module: Optional<Module, 'id' | 'props'>,
    updateDevice = true
  ) => {
    module.id ??= nextId.value++
    module.props ??= definitions.getDefaultProps(module.type)
    items.value.set(module.id, module as Module)
    sortedIds.value.push(module.id)

    if (updateDevice) device.update('/e/modules/add', [module.id, module.type])

    return module as Module
  }

  const remove = async (id: Id, updateDevice = true) => {
    const module = get(id)
    if (!module) return

    const removedConnections = connections.getByModuleId(id)
    removedConnections.forEach(({ id }) => connections.remove(id, false))
    // Wait for the connections to be removed, otherwise they might still be
    // there after the module has been deleted, causing warnings.
    await nextTick()

    if (focusedId.value === id) focusedId.value = undefined
    if (selectedIds.value.has(id)) selectedIds.value.delete(id)
    items.value.delete(id)
    sortedIds.value.splice(sortedIds.value.indexOf(id), 1)

    if (updateDevice) device.update('/e/modules/remove', [id])
    return { module, connections: removedConnections }
  }

  const focus = (id: Id | undefined) => {
    focusedId.value = id
    if (id === undefined) return
    sortedIds.value.splice(sortedIds.value.indexOf(id), 1).push(id)
    sortedIds.value.push(id)
  }

  const updateProp = (
    id: Id,
    name: string,
    value: unknown,
    updateDevice = true
  ) => {
    const item = get(id)
    if (!item) return

    item.props[name] = value
    if (updateDevice) device.update('/e/modules/prop', [id, name, value])
  }

  const clear = () => {
    items.value.clear()
    sortedIds.value = []
    nextId.value = 1
  }

  return {
    items,
    focusedId,
    focusedItem,
    selectedIds,
    selectedItems,
    isDragging,
    activeInputIds,
    activeOutputIds,
    serialize,
    deserialize,
    get,
    getConnector,
    getSortIndex,
    add,
    remove,
    focus,
    updateProp,
    clear,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useModules, import.meta.hot))
