import { useBridge } from '@/bridge'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDevice = defineStore('device', () => {
  const isConnected = ref(false)

  const bridge = useBridge()
  bridge.on('/close', () => (isConnected.value = false))

  bridge.on('/log/:type', ({ args: [text] }, { type }) =>
    (console as any)[type]?.(text)
  )

  const open = async () => {
    await bridge.open({ baudRate: 9600 })
    isConnected.value = true
  }

  const close = async () => {
    await bridge.close()
    isConnected.value = false
  }

  return { isConnected, open, close }
})
