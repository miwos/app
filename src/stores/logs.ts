import { useLoa } from '@/services/loa'
import { Log } from '@/types/Log'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

export const useLogs = defineStore('logs', () => {
  const loa = useLoa()
  const state = reactive({
    items: [] as Log[],
    maxItems: 500,
  })

  loa.on('/log/:type', ({ args: [text] }, params) =>
    add(params.type as Log['type'], text)
  )

  // Actions
  const add = (type: Log['type'], text: Log['text']) => {
    state.items.push({ type, text })
    state.items.splice(-state.maxItems)
  }

  return { ...toRefs(state), add }
})
