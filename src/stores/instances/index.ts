import { eventEmitter } from '@/eventEmitter'
import { useLoa } from '@/services/loa'
import { useConnections } from '@/stores/connections'
import { useEncoders } from '@/stores/encoders'
import { useModules } from '@/stores/modules'
import { usePatch } from '@/stores/patch'
import { Connection } from '@/types/Connection'
import { Encoder } from '@/types/Encoders'
import {
  ModuleInstance,
  ModuleInstanceSerialized,
} from '@/types/ModuleInstance'
import { Point } from '@/types/Point'
import { errorMessage } from '@/utils'
import { defineStore } from 'pinia'
import { computed, reactive, toRefs } from 'vue'
import {
  createInstance,
  deserializeInstance,
  getPropsDefaults,
  serializeInstance,
  updatePatchDebounced,
} from './utils'

type Id = ModuleInstance['id']
type ModuleId = ModuleInstance['moduleId']

export const useInstances = defineStore('instances', () => {
  const loa = useLoa()
  const modules = useModules()
  const patch = usePatch()
  const connections = useConnections()
  const encoders = useEncoders()

  const state = reactive({
    items: new Map<Id, ModuleInstance>(),
    sortedIds: [] as Id[],
    focusedId: null as Id | null,
    activeInputs: new Set<`${Id}-${number}`>(),
    activeOutputs: new Set<`${Id}-${number}`>(),
    // We use a one-based index to be consistent with lua.
    nextId: 1,
  })

  loa.on('/instances/prop', ({ args: [id, name, value] }) => {
    try {
      get(id).props.set(name, value)
    } catch (e) {
      console.warn(`Can't set value for prop '${name}': ${errorMessage(e)}`)
    }
  })

  loa.on('/instance/message', ({ args: [id, name, ...payload] }) => {
    eventEmitter.emit('instance-message', { name, id, payload })
  })

  loa.on('/instances/update', async ({ args: [id] }) => {
    get(id).isUpdating = false
  })

  loa.on('/instances/outputs', ({ args: [serializedOutputs] }) => {
    state.activeInputs.clear()
    state.activeOutputs.clear()
    connections.activeIds.clear()

    if (serializedOutputs !== '') {
      state.activeOutputs = new Set(serializedOutputs.split(','))
      for (const { id, from, to } of connections.list) {
        if (state.activeOutputs.has(from.id)) {
          state.activeInputs.add(to.id)
          connections.activeIds.add(id)
        }
      }
    }
  })

  // Getters
  const get = (id: Id): ModuleInstance => {
    const instance = state.items.get(id)
    if (!instance) throw new Error(`Can't find Instance@${id}.`)
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

    return id
  }

  const serialize = () =>
    Object.fromEntries(list.value.map((v) => [v.id, serializeInstance(v)]))

  const restore = (
    id: Id,
    data: Pick<ModuleInstance, 'moduleId' | 'position' | 'props'>,
    updateDevice = true
  ) => {
    if (state.items.has(id)) {
      console.warn(`Instance with id '${id}' already exists.`)
      return
    }

    state.items.set(id, createInstance({ ...data, id }))
    state.sortedIds.push(id)
    // If we restore a module instance (e.g. while loading a patch from the
    // device) we have to make sure that we won't use the restored module's id
    // for future modules. The easiest way is to just bigger ids.
    state.nextId = Math.max(state.nextId, id + 1)

    if (updateDevice) patch.update()
  }

  const remove = (id: Id, updateDevice = true) => {
    // Remove all encoders and connections that rely on the instance we are
    // about to remove.

    const removedConnections: Connection[] = []
    for (const connection of connections.listConnectedToInstance(id)) {
      removedConnections.push(connection)
      connections.remove(connection.id, false)
    }

    const removedEncoders: [pageIndex: number, encoder: Encoder][] = []
    encoders.pages.forEach((page, index) => {
      for (const encoder of page.values()) {
        if (encoder.instanceId === id) {
          removedEncoders.push([index, encoder])
          encoders.unmap(encoder.id, index)
        }
      }
    })

    const removedInstance = get(id)
    state.sortedIds.splice(state.sortedIds.indexOf(id), 1)
    state.items.delete(id)

    if (updateDevice) patch.update()

    return {
      instance: removedInstance,
      connections: removedConnections,
      encoders: removedEncoders,
    }
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
    // state.nextId = 1
    state.sortedIds = []
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
    serialize,
    restore,
    remove,
    focus,
    updateProp,
    clear,
  }
})
