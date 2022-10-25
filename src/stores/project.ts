import { useBridge } from '@/bridge'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDevice } from './device'

export const useProject = defineStore('project', () => {
  const activePartIndex = ref(0)
  const bridge = useBridge()
  const device = useDevice()

  bridge.on('/parts/select', ({ args: [index] }) => selectPart(index, false))

  const selectPart = (index: number, updateDevice = true) => {
    activePartIndex.value = index
    if (updateDevice) device.update('/parts/select', [index])
  }

  return { activePartIndex, selectPart }
})
