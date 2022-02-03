import { defineStore } from 'pinia'
import { useBridge } from '@/services/bridge'
import { createLuaPatch } from '../utils'
import { useConnections } from './connections'
import { useInstances } from './instances'

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
      useInstances().clear(false)
      useConnections().clear(false)
      this.update()
    },
  },
})
