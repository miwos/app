import { defineStore } from 'pinia'
import { useBridge } from '../bridge'
import { createLuaPatch } from '../utils'
import { useConnections } from './connections'
import { useModules } from './modules'

export const usePatch = defineStore({
  id: 'patch',

  state: () => ({
    name: 'patch1',
  }),

  actions: {
    update() {
      const bridge = useBridge()
      if (bridge.isConnected.value)
        bridge.updatePatch(this.name, createLuaPatch())
    },

    clear() {
      useModules().clearAll(false)
      useConnections().clearAll(false)
      this.update()
    },
  },
})
