import { defineStore } from 'pinia'
import { useBridge } from '../bridge'
import { createLuaPatch, getConnectionId } from '../utils'
import { usePatch } from './patch'

export const useConnections = defineStore({
  id: 'connections',

  state: () => ({
    items: {} as Record<string, Connection>,
    startConnectionPoint: null as ConnectionPoint | null,
  }),

  getters: {
    connectedToModule: (state) => (moduleId: number) =>
      Object.values(state.items).filter(
        (item) =>
          item.from.moduleId === moduleId || item.to.moduleId === moduleId
      ),
  },

  actions: {
    connectFrom(connectionPoint: ConnectionPoint) {
      this.startConnectionPoint = connectionPoint
    },

    connectTo(connectionPoint: ConnectionPoint) {
      if (!this.startConnectionPoint) return
      const { type: startType } = this.startConnectionPoint
      if (startType === connectionPoint.type)
        throw new Error(`Can't connect type '${startType}' to '${startType}'`)

      // We always store the points in the order (output) -> (input). But it is
      // also possible to draw the connections from (input) to (output) so we
      // have to make sure that they are in the correct order.
      const connectionPoints = [this.startConnectionPoint, connectionPoint]
      if (startType === 'input') connectionPoints.reverse()

      const [from, to] = connectionPoints
      const id = getConnectionId(from, to)
      this.items[id] = { id, from, to }

      usePatch().update()
    },

    removeConnection(connectionId: string, update = true) {
      delete this.items[connectionId]
      if (update) usePatch().update()
    },

    clearAll(update = true) {
      this.items = {}
      this.startConnectionPoint = null
      if (update) usePatch().update()
    },
  },
})
