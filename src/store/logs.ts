import { defineStore } from 'pinia'

export type LogType = 'info' | 'warning' | 'error' | 'success' | 'print'

export const useLogs = defineStore({
  id: 'logs',

  state: () => ({
    logs: [] as { type: LogType; text: string }[],
  }),

  actions: {
    addLog(type: LogType, text: string) {
      this.logs.push({ type, text })
    },
  },
})
