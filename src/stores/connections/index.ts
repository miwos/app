import {
  Connection,
  ConnectionPoint,
  ConnectionSerialized,
} from '@/types/Connection'
import { ModuleInstance } from '@/types/ModuleInstance'
import { defineStore } from 'pinia'
import { computed, reactive, toRefs } from 'vue'
import { usePatch } from '@/stores/patch'
import {
  asInput,
  asOutput,
  deserializeConnection,
  getConnectionId,
  pointsCanConnect,
  serializeConnection,
  sortPointsByPosition,
} from './utils'

type Id = Connection['id']
type InstanceId = ModuleInstance['id']

export const useConnections = defineStore('connections', () => {
  const patch = usePatch()

  const state = reactive({
    items: new Map<Id, Connection>(),
    hoveredId: undefined as Connection['id'] | undefined,
    focusedId: undefined as Connection['id'] | undefined,
    startPoint: undefined as ConnectionPoint | undefined,
    activeIds: new Set<Connection['id']>(),
  })

  // Getters
  const get = (id: Id) => {
    const connection = state.items.get(id)
    if (!connection) throw new Error(`Can't find connection with id '${id}'`)
    return connection
  }

  const list = computed(() => Array.from(state.items.values()))

  const listConnectedToInstance = (id: InstanceId) =>
    Array.from(state.items.values()).filter(
      (item) => item.from.instanceId === id || item.to.instanceId === id
    )

  const hovered = computed(() =>
    state.hoveredId ? state.items.get(state.hoveredId) : undefined
  )

  const focused = computed(() =>
    state.focusedId ? state.items.get(state.focusedId) : undefined
  )

  const isHovered = (id: Id) => computed(() => state.hoveredId === id)
  const isFocused = (id: Id) => computed(() => state.focusedId === id)

  const canConnect = (point: ConnectionPoint) =>
    computed(
      () => state.startPoint && pointsCanConnect(state.startPoint, point)
    )

  // Actions
  const hover = (id?: Id) => (state.hoveredId = id)
  const focus = (id?: Id) => (state.focusedId = id)

  const add = (
    from: ConnectionPoint,
    to: ConnectionPoint,
    updateDevice = true
  ) => {
    const id = getConnectionId(from, to)
    state.items.set(id, { id, from, to })
    if (updateDevice) patch.update()
  }

  const serialize = () => list.value.map(serializeConnection)

  const restore = (serializedConnections: ConnectionSerialized[]) => {
    for (const serialized of serializedConnections) {
      const { from, to } = deserializeConnection(serialized)
      add(from, to, false)
    }
  }

  const connectFrom = (point: ConnectionPoint) => (state.startPoint = point)

  const connectTo = (point: ConnectionPoint) => {
    const { startPoint } = state
    if (!startPoint) return

    const bothAreInout = point.isInOut && startPoint.isInOut

    // Sort the points so our connection will always flow from `out` to
    // `in`. If both points have the special direction `inout` we have to make
    // a guess based on the points positions, treating the higher point as
    // `out` and the lower as the `in`. Otherwise we look for a point with a
    // distinct direction (not `inout`) and sort them based an that point.
    const connectionPoints = bothAreInout
      ? sortPointsByPosition(startPoint, point)
      : (!startPoint.isInOut && startPoint.direction === 'out') ||
        (!point.isInOut && point.direction === 'in')
      ? [startPoint, point]
      : [point, startPoint]

    const [from, to] = connectionPoints
    // To keep things simple, we only render the input of an `inout`.
    // Depending on the connection we make, this input could also represent
    // the output, so we make sure to 'cast' the connection point to the
    // correct type.
    add(asOutput(from), asInput(to))

    state.startPoint = undefined
  }

  const remove = (id: Id, updateDevice = true) => {
    state.items.delete(id)
    hover()
    focus()
    if (updateDevice) patch.update()
  }

  const clear = (updateDevice = true) => {
    state.items.clear()
    state.startPoint = undefined
    if (updateDevice) patch.update()
  }

  return {
    ...toRefs(state),
    get,
    list,
    listConnectedToInstance,
    hovered,
    focused,
    isHovered,
    isFocused,
    canConnect,
    hover,
    focus,
    add,
    serialize,
    restore,
    connectFrom,
    connectTo,
    remove,
    clear,
  }
})
