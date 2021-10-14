import { defineStore } from 'pinia'
import { useBridge } from '../bridge'
import { createLuaPatch } from '../utils'

export const useInterface = defineStore({
  id: 'interface',

  state: () => ({
    pages: [
      {
        encoders: [{ moduleId: 3, propName: 'speed' }],
      },
    ] as Array<InterfacePage>,
  }),

  actions: {
    mapEncoder(encoderId: number, moduleId: number, propName: string) {
      this.pages[0].encoders[encoderId] = { moduleId, propName }
      useBridge().updatePatch('patch1', createLuaPatch())
    },
  },
})
