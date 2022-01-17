import { Log } from '@/types/Log'
import { defineStore } from 'pinia'

export const useLogs = defineStore({
  id: 'logs',

  state: () => ({
    logs: [] as Log[],
  }),

  actions: {
    addLog(type: Log['type'], text: Log['text']) {
      this.logs.push({ type, text })
    },
  },
})
