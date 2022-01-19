import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePatch } from './patch'
import { Mapping } from '@/types/Mapping'

export const useMapping = defineStore({
  id: 'mapping',

  state: () => ({
    currentPage: 0,
    pages: [{ encoders: {} }] as Mapping,
  }),

  getters: {
    findMappedEncoder: (state) => (instanceId: number, propName: string) =>
      computed(() =>
        Object.values(state.pages[0].encoders).find(
          (encoder) =>
            encoder.instanceId === instanceId && encoder.propName === propName
        )
      ),
  },

  actions: {
    mapEncoder(encoderId: number, instanceId: number, propName: string) {
      console.log({ encoderId })

      this.pages[0].encoders[encoderId] = {
        id: encoderId,
        instanceId,
        propName,
      }
      usePatch().update()
    },

    selectPage(index: number) {
      this.currentPage = index
    },
  },
})
