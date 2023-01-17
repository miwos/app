import { useBridge } from '@/bridge'
import type { DeviceMethods } from '@/types/DeviceMethods'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLog } from './log'
import type { LogType } from './log'
import { useModuleDefinitions } from './moduleDefinitions'
import { useProject } from './project'
import { luaToJson } from '@/utils'

export const useDevice = defineStore('device', () => {
  const isConnected = ref(false)

  const bridge = useBridge()
  const project = useProject()
  const moduleDefinitions = useModuleDefinitions()
  const log = useLog()

  bridge.on('/close', () => (isConnected.value = false))

  bridge.on('/log/:type', ({ args: [text] }, { type }) => {
    if (['info', 'warn', 'error'].includes(type)) {
      log.log(type as LogType, text)
    } else if (type === 'dump') {
      log.dump(luaToJson(text))
    } else if (type === 'stack') {
      // log.stack(text)
    }
  })

  const open = async () => {
    await bridge.open({ baudRate: 9600 })
    isConnected.value = true
    await moduleDefinitions.loadAllFromDevice()
    window.postMessage({ method: 'deviceConnected' })
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
    // TODO: remove `any`, use `MessageArg` as soon as bridge exports it, or
    // make args optional in bridge itself.
    return bridge.request(method, args ?? ([] as any[])) as Promise<
      ReturnType<DeviceMethods[M]>
    >
  }

  const request = <M extends keyof DeviceMethods>(
    method: M,
    args?: Parameters<DeviceMethods[M]>
  ) => {
    if (!isConnected.value) return
    // TODO: remove `any`, use `MessageArg` as soon as bridge exports it, or
    // make args optional in bridge itself.
    return bridge.request(method, args ?? ([] as any)) as Promise<
      ReturnType<DeviceMethods[M]>
    >
  }

  return { isConnected, open, close, update, request }
})
