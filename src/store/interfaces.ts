import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePatch } from './patch'

export const useInterfaces = defineStore({
  id: 'interfaces',

  state: () => ({
    currentPage: 1,
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
      this.pages[0].encoders[encoderId] = { moduleId, propName }
      usePatch().update()
    },

    selectPage(index: number) {
      this.currentPage = index
    },
  },
})
