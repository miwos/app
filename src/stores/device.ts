import { useLoa } from '@/services/loa'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { useModules } from './modules'
import { usePatch } from './patch'

export const useDevice = defineStore('device', () => {
  const loa = useLoa()
  const modules = useModules()
  const patch = usePatch()

  let memoryInterval: number
  const state = reactive({
    isConnected: false,
    usedMemory: 0,
  })

  loa.on('/disconnect', () => (state.isConnected = false))

  const connect = async () => {
    await loa.connect()
    state.isConnected = true
    // TODO: rename
    loa.sendMessage('/bridge/connect')

    await modules.loadFromDevice()
    patch.load()

    memoryInterval = window.setInterval(async () => {
      state.usedMemory = parseInt(await loa.sendRequest('/info/memory-usage'))
    }, 1000)
  }

  const disconnect = async () => {
    clearInterval(memoryInterval)
    await loa.close()
    state.isConnected = false
  }

  return { ...toRefs(state), connect, disconnect }
})
