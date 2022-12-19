import { useBridge } from '@/bridge'
import type { DeviceMethods } from '@/types/DeviceMethods'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useProject } from './project'

export const useDevice = defineStore('device', () => {
  const isConnected = ref(false)

  const bridge = useBridge()
  const project = useProject()

  bridge.on('/close', () => (isConnected.value = false))

  bridge.on('/log/:type', ({ args: [text] }, { type }) =>
    (console as any)[type]?.(text)
  )

  const open = async () => {
    await bridge.open({ baudRate: 9600 })
    isConnected.value = true
    project.load()
  }

  const close = async () => {
    await bridge.close()
    isConnected.value = false
  }

  const update = <M extends keyof DeviceMethods>(
    method: M,
    args?: Parameters<DeviceMethods[M]>
  ) => {
    if (!isConnected.value) return
    // The device's storage is our source of truth for the project. Therefore
    // with each update we also save the whole project.
    project.save()
    return bridge.request(method, args ?? []) as Promise<
      ReturnType<DeviceMethods[M]>
    >
  }

  return { isConnected, open, close, update }
})
