import { useLoa } from '@/services/loa'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { usePatch } from './patch'

export const useParts = defineStore('parts', () => {
  const loa = useLoa()
  const patch = usePatch()

  const state = reactive({
    currentIndex: 0,
  })

  loa.on('/parts/select', ({ args: [index] }) => select(index, false))

  const select = (index: number, updateDevice = true) => {
    state.currentIndex = index
    patch.load(`patch${index + 1}`, false) // patch names are one-based
    if (updateDevice) loa.sendMessage('/parts/select', index)
  }

  return { ...toRefs(state), select }
})
