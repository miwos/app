import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useBridge } from '../bridge'
import { createLuaPatch } from '../utils'

export const useInterfaces = defineStore({
  id: 'interfaces',

  state: () => ({
    pages: [
      {
        encoders: [{ moduleId: 3, propName: 'speed' }],
      },
    ] as Array<InterfacePage>,
  }),

  getters: {
    getEncoderId: (state) => (moduleId: number, propName: string) =>
      // Add 1 to be consistent with lua's 1-based index.
      computed(
        () =>
          state.pages[0].encoders.findIndex(
            (encoder) =>
              encoder.moduleId === moduleId && encoder.propName === propName
          ) + 1
      ),
  },

  actions: {
    mapEncoder(encoderId: number, moduleId: number, propName: string) {
      // Subtract 1 to convert lua's 1-based index to javascript index.
      this.pages[0].encoders[encoderId - 1] = { moduleId, propName }
      useBridge().updatePatch('patch1', createLuaPatch())
    },
  },
})
