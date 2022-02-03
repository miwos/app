import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePatch } from './patch'
import { Mapping } from '@/types/Mapping'
import { range } from '@/utils'
import { useBridge } from '@/services/bridge'

const createEncoders = (count: number) =>
  Object.fromEntries(
    range(count).map((i) => {
      const id = i + 1
      return [id, { id, value: 0 }]
    })
  )

const createPage = (encodersCount: number) => ({
  encoders: createEncoders(encodersCount),
})

export const useMapping = defineStore({
  id: 'mapping',

  state: () => ({
    currentPageIndex: 0,
    pages: range(3).map(() => createPage(3)) as Mapping,
  }),

  getters: {
    currentPage: (state) => state.pages[state.currentPageIndex],

    getMappedEncoder: (state) => (instanceId: number, propName: string) =>
      computed(() =>
        Object.values(state.pages[state.currentPageIndex].encoders).find(
          ({ mappedTo }) =>
            mappedTo &&
            mappedTo.instanceId === instanceId &&
            mappedTo.propName === propName
        )
      ),
  },

  actions: {
    mapEncoder(encoderId: number, instanceId: number, propName: string) {
      // First check if the property was already mapped to a different encoder.
      const prevEncoder = Object.values(this.currentPage.encoders).find(
        ({ mappedTo }) =>
          mappedTo &&
          mappedTo.instanceId === instanceId &&
          mappedTo.propName === propName
      )
      if (prevEncoder) this.clearEncoder(prevEncoder.id)

      const encoder = this.currentPage.encoders[encoderId]
      encoder!.mappedTo = { instanceId, propName }
      usePatch().update()
    },

    clearEncoder(encoderId: number) {
      this.currentPage.encoders[encoderId].mappedTo = null
    },

    selectPage(index: number) {
      this.currentPageIndex = index
      useBridge().selectPage(index)
    },
  },
})
