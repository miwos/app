import { defineStore } from 'pinia'

export type ViewMode = 'minimal' | 'verbose'

export const useApp = defineStore('app', {
  state: () => ({
    viewMode: 'minimal' as ViewMode,
  }),

  actions: {
    toggleViewMode() {
      this.viewMode = this.viewMode === 'minimal' ? 'verbose' : 'minimal'
    },
  },
})
