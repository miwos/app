import { eventEmitter } from '@/eventEmitter'
import { ModuleInstance } from '@/types/ModuleInstance'
import { ComputedRef, inject, onMounted, onUnmounted } from 'vue'

export const onMessage = (name: string, callback: (...payload: any) => any) => {
  let instanceId: number | undefined

  const handler = (args: any) =>
    args.id === instanceId && args.name === name && callback(...args.payload)

  onMounted(() => {
    const instance = inject<ComputedRef<ModuleInstance>>('instance')
    instanceId = instance?.value.id
    eventEmitter.on('instance-message', handler)
  })

  onUnmounted(() => eventEmitter.off(name, handler))
}
