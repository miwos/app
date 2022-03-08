import { useLoa } from '@/services/loa'
import { useConnections } from '@/stores/connections'
import { useMapping } from '@/stores/mapping'
import { useModules } from '@/stores/modules'
import { usePatch } from '@/stores/patch'
import { ModuleInstance } from '@/types/ModuleInstance'
import { Point } from '@/types/Point'
import { defineStore } from 'pinia'
import { computed, reactive, toRefs } from 'vue'
import { createInstance, getPropsDefaults, updatePatchDebounced } from './utils'

type Id = ModuleInstance['id']
type ModuleId = ModuleInstance['moduleId']

export const useInstances = defineStore('instances', () => {
  const loa = useLoa()
  const modules = useModules()
  const patch = usePatch()
  const connections = useConnections()
  const mapping = useMapping()

  const state = reactive({
    items: new Map<Id, ModuleInstance>(),
    sortedIds: [] as Id[],
    focusedId: null as Id | null,
    // We use a one-based index to be consistent with lua.
    nextId: 1,
  })

  loa.on('/instance/prop', ({ args: [id, name, value] }) =>
    get(id).props.set(name, value)
  )

  loa.on(
    '/instance/update',
    async ({ args: [id] }) => (get(id).isUpdating = false)
  )

  // Getters
  const get = (id: Id): ModuleInstance => {
    const instance = state.items.get(id)
    if (!instance) throw new Error(`Can't find instance with id '${id}'`)
    return instance
  }

  const list = computed(() => Array.from(state.items.values()))
  const sorted = computed(() => state.sortedIds.map(get))
  const isFocused = (id: Id) => computed(() => state.focusedId === id)

  // Actions
  const add = (moduleId: ModuleId, position: Point, updateDevice = true) => {
    const module = modules.get(moduleId)
    const id = state.nextId++
    const props = getPropsDefaults(module.props)

    state.items.set(id, createInstance({ id, moduleId, position, props }))
    state.sortedIds.push(id)
    if (updateDevice) patch.update()
  }

  const restore = (
    data: Omit<ModuleInstance, 'activeInputOutputIds' | 'isUpdating'>
  ) => {
    const { id } = data
    if (state.items.has(id))
      throw new Error(`Instance with id '${id}' already exists.`)

    state.items.set(id, createInstance(data))
    state.sortedIds.push(id)
    state.nextId = Math.max(state.nextId, id + 1)
  }

  const remove = (id: Id, updateDevice = true) => {
    // Remove all connections that are connected to the module we are about
    // to remove.
    for (const connection of connections.listConnectedToInstance(id))
      connections.remove(connection.id, false)

    // Remove all encoders that were mapped to the instance.
    for (const page of mapping.pages) {
      for (const encoder of Object.values(page.encoders)) {
        if (encoder.mappedTo && encoder.mappedTo.instanceId === id) {
          mapping.clearEncoder(encoder.id)
        }
      }
    }

    state.sortedIds.splice(state.sortedIds.indexOf(id), 1)
    state.items.delete(id)

    if (updateDevice) patch.update()
  }

  const focus = (id: Id | null) => {
    state.focusedId = id
    if (id) {
      state.sortedIds.splice(state.sortedIds.indexOf(id), 1).push(id)
      state.sortedIds.push(id)
    }
  }

  const updateProp = (
    id: Id,
    name: string,
    value: number,
    updateDevice = true
  ) => {
    const instance = get(id)
    instance.props.set(name, value)

    if (updateDevice) {
      loa.sendMessage('/patch/prop', [id, name, value])
      // Setting a prop can happen many times per second, so we debounce the
      // patch update.
      updatePatchDebounced()
    }
  }

  const clear = (updateDevice = true) => {
    state.nextId = 1
    state.items.clear()
    if (updateDevice) patch.update()
  }

  return {
    ...toRefs(state),
    get,
    list,
    sorted,
    isFocused,
    add,
    restore,
    remove,
    focus,
    updateProp,
    clear,
  }
})
