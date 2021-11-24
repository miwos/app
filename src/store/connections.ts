import { computed } from 'vue'
import { defineStore } from 'pinia'
import { getConnectionId } from '../utils'
import { usePatch } from './patch'

export const useConnections = defineStore({
  id: 'connections',

  state: () => ({
    items: {} as Record<string, Connection>,
    hoveredConnectionId: null as string | null,
    focusedConnectionId: null as string | null,
    startConnectionPoint: null as ConnectionPoint | null,
  }),

  getters: {
    connectedToModule: (state) => (moduleId: number) =>
      Object.values(state.items).filter(
        (item) =>
          item.from.moduleId === moduleId || item.to.moduleId === moduleId
      ),

    isHovered: (state) => (connectionId: string) =>
      computed(() => state.hoveredConnectionId === connectionId),

    isFocused: (state) => (connectionId: string) =>
      computed(() => state.focusedConnectionId === connectionId),

    hoveredConnection: (state) =>
      state.hoveredConnectionId ? state.items[state.hoveredConnectionId] : null,

    focusedConnection: (state) =>
      state.focusedConnectionId ? state.items[state.focusedConnectionId] : null,
  },

  actions: {
    hover(connectionId: string | null) {
      this.hoveredConnectionId = connectionId
    },

    focus(connectionId: string | null) {
      this.focusedConnectionId = connectionId
    },

    connectFrom(connectionPoint: ConnectionPoint) {
      this.startConnectionPoint = connectionPoint
    },

    async connectTo(connectionPoint: ConnectionPoint) {
      if (!this.startConnectionPoint) return
      const { type: startType } = this.startConnectionPoint
      if (startType === connectionPoint.type)
        throw new Error(`Can't connect type '${startType}' to '${startType}'`)

      // We always store the points in the order from output to input. But it is
      // also possible to draw the connections from input to output.
      const connectionPoints = [this.startConnectionPoint, connectionPoint]
      if (startType === 'input') connectionPoints.reverse()

      const [from, to] = connectionPoints
      const id = getConnectionId(from, to)
      this.items[id] = { id, from, to }

      usePatch().update()
    },

    remove(connectionId: string, update = true) {
      delete this.items[connectionId]
      this.hover(null)
      this.focus(null)
      if (update) usePatch().update()
    },

    clear(update = true) {
      this.items = {}
      this.startConnectionPoint = null
      if (update) usePatch().update()
    },
  },
})
