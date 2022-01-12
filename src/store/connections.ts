import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePatch } from './patch'
import { ModuleInstance, useModuleInstances } from './moduleInstances'
import { ShapeHandle } from './shapes'
import { useModules } from './modules'

export interface ConnectionPoint {
  type: ShapeHandle['type']
  index: number
  instanceId: ModuleInstance['id']
}

export interface Connection {
  id: string
  from: ConnectionPoint
  to: ConnectionPoint
}

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

      const bothAreTransforms =
        point.type === 'transform' && startPoint.type === 'transform'

      // Sort the points so our connection will always flow from `input` to
      // `output`. If both points are of type `transform` we have to make a
      // guess based on the points positions, treating the higher point as the
      // `output` and the lower as the `input`.
      const connectionPoints = bothAreTransforms
        ? sortPointsByPosition(startPoint, point)
        : startPoint.type === 'output' || point.type === 'input'
        ? [startPoint, point]
        : [point, startPoint]

      const [from, to] = connectionPoints
      const id = getConnectionId(from, to)
      this.items[id] = { id, from, to }

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
