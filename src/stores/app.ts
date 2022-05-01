import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

export type ViewMode = 'minimal' | 'verbose'

export const useApp = defineStore('app', () => {
  const state = reactive({
    viewMode: 'minimal' as ViewMode,
    triggerDuration: 100,
    isMapping: false,
  })

  // Actions
  const toggleViewMode = () =>
    (state.viewMode = state.viewMode === 'minimal' ? 'verbose' : 'minimal')

  return { ...toRefs(state), toggleViewMode }
})
