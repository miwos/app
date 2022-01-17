import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePatch } from './patch'
import { useModuleInstances } from './moduleInstances'
import { Connection, ConnectionPoint } from '@/types/Connection'
import { ModuleInstance } from '@/types/ModuleInstance'

const getConnectionId = (from: ConnectionPoint, to: ConnectionPoint) =>
  `(${from.instanceId},${from.index})-(${to.instanceId},${to.index})`

const sortPointsByPosition = (a: ConnectionPoint, b: ConnectionPoint) => {
  const instances = useModuleInstances()
  const positionA = instances.find(a.instanceId).position
  const positionB = instances.find(b.instanceId).position
  return positionA.y < positionB.y ? [a, b] : [b, a]
}

export const useConnections = defineStore({
  id: 'connections',

  state: () => ({
    items: {} as Record<string, Connection>,
    hoveredId: null as string | null,
    focusedId: null as string | null,
    startPoint: null as ConnectionPoint | null,
  }),

  getters: {
    find: (state) => (id: Connection['id']) => state.items[id],

    listConnectedToInstance: (state) => (id: ModuleInstance['id']) =>
      Object.values(state.items).filter(
        (item) => item.from.instanceId === id || item.to.instanceId === id
      ),

    hovered: (state) => (state.hoveredId ? state.items[state.hoveredId] : null),

    focused: (state) => (state.focusedId ? state.items[state.focusedId] : null),

    isHovered: (state) => (id: Connection['id']) =>
      computed(() => state.hoveredId === id),

    isFocused: (state) => (id: Connection['id']) =>
      computed(() => state.focusedId === id),

    canConnect: (state) => (point: ConnectionPoint) =>
      computed(() => {
        if (!state.startPoint) return false
        const { instanceId, signal, direction } = state.startPoint

        const haveDifferentInstance = instanceId !== point.instanceId
        const haveSameSignals = signal === point.signal
        const haveCompatibleDirections =
          direction != point.direction || direction === 'inout'

        return (
          haveDifferentInstance && haveSameSignals && haveCompatibleDirections
        )
      }),
  },

  actions: {
    hover(id: Connection['id'] | null) {
      this.hoveredId = id
    },

    focus(id: Connection['id'] | null) {
      this.focusedId = id
    },

    connectFrom(point: ConnectionPoint) {
      this.startPoint = point
    },

    async connectTo(point: ConnectionPoint) {
      const { startPoint } = this
      if (!startPoint) return

      const bothAreInout =
        point.direction === 'inout' && startPoint.direction === 'inout'

      // Sort the points so our connection will always flow from `out` to
      // `in`. If both points have the special direction `inout` we have to make
      // a guess based on the points positions, treating the higher point as
      // `out` and the lower as the `in`.
      const connectionPoints = bothAreInout
        ? sortPointsByPosition(startPoint, point)
        : startPoint.direction === 'out' || point.direction === 'in'
        ? [startPoint, point]
        : [point, startPoint]

      const [from, to] = connectionPoints
      const id = getConnectionId(from, to)
      this.items[id] = { id, from, to }

      this.startPoint = null
      usePatch().update()
    },

    remove(id: Connection['id'], update = true) {
      delete this.items[id]
      this.hover(null)
      this.focus(null)
      if (update) usePatch().update()
    },

    clear(update = true) {
      this.items = {}
      this.startPoint = null
      if (update) usePatch().update()
    },
  },
})
