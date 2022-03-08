import { Log } from '@/types/Log'
import { defineStore } from 'pinia'

export const useLogs = defineStore('logs', {
  state: () => ({
    items: [] as Log[],
  }),

  actions: {
    add(type: Log['type'], text: Log['text']) {
      this.items.push({ type, text })
    },
  },
})
