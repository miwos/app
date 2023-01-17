import { useBridge } from '@/bridge'
import { useDevice } from '@/stores/device'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useModuleDefinitions } from './moduleDefinitions'

export const useApp = defineStore('app', () => {
  const showPropFields = ref(false)
  const isMapping = ref(false)

  const bridge = useBridge()
  const device = useDevice()
  const definitions = useModuleDefinitions()

  window.addEventListener('message', async ({ data }) => {
    if (!data.method) return

    if (!device.isConnected) {
      console.warn('Device is not connected.')
      return
    }

    if (data.method === 'updateFile') {
      const { path, content } = data.params
      await bridge.writeFile(`lua/${path}`, content)
      const isHotReplaced = await bridge.request('/lua/update', `lua/${path}`)

      const match = path.match(/^modules\/(.*)\.lua$/)
      if (match) {
        const [, moduleName] = match
        definitions.loadFromDevice(moduleName)
      }
      return
    }

    if (data.method === 'writeFile') {
      const { path, content } = data.params
      await bridge.writeFile(`lua/${path}`, content)
      return
    }
  })

  return { showPropFields, isMapping }
})
