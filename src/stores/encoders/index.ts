import { useLoa } from '@/services/loa'
import { usePatch } from '@/stores/patch'
import { Encoder, EncoderPageSerialized } from '@/types/Encoders'
import { ModuleInstance } from '@/types/ModuleInstance'
import { range } from '@/utils'
import { defineStore } from 'pinia'
import { computed, reactive, toRefs } from 'vue'
import { useInstances } from '../instances'
import {
  deserializeEncoderPage,
  isMappedTo,
  serializeEncoderPage,
} from './utils'

type Id = Encoder['id']
type InstanceId = ModuleInstance['id']

export const useEncoders = defineStore('encoders', () => {
  const loa = useLoa()
  const patch = usePatch()
  const instances = useInstances()

  const state = reactive({
    currentPageIndex: 0,
    pages: range(3).map(() => new Map<Id, Encoder>()),
  })

  loa.on('/encoders/page', ({ args: [index] }) => selectPage(index, false))

  // Getters
  const currentPage = computed(() => state.pages[state.currentPageIndex])
  const list = computed(() => Array.from(currentPage.value.values()))
  const get = (id: Id) => currentPage.value.get(id)

  const getMapped = (instanceId: InstanceId, propName: string) =>
    computed(() =>
      list.value.find((encoder) => isMappedTo(encoder, instanceId, propName))
    )

  // Actions
  const serialize = () => state.pages.map(serializeEncoderPage)

  const restore = (serializedPages: EncoderPageSerialized[]) => {
    const filterMissingInstances = ([id, encoder]: [number, Encoder]) => {
      if (!instances.items.has(encoder.instanceId)) {
        console.warn(
          `Discard mapping for encoder#${id} because mapped Instance@${encoder.instanceId} doesn't exist.`
        )
        return false
      } else {
        return true
      }
    }
    state.pages = serializedPages
      .map(deserializeEncoderPage)
      .map(
        (v) => new Map(Array.from(v.entries()).filter(filterMissingInstances))
      )
  }

  const map = (
    id: Encoder['id'],
    instanceId: InstanceId,
    propName: string,
    updateDevice = true
  ) => {
    // Remove any previous mapping as an instance prop should only be mapped to
    // on encoder at a time.
    const prevEncoder = list.value.find((encoder) =>
      isMappedTo(encoder, instanceId, propName)
    )
    if (prevEncoder) unmap(prevEncoder.id)

    currentPage.value.set(id, { id, instanceId, propName })
    if (updateDevice) patch.update()
  }

  const unmap = (id: Encoder['id']) => currentPage.value.delete(id)

  const selectPage = (index: number, updateDevice = true) => {
    state.currentPageIndex = index
    if (updateDevice) loa.sendMessage('/encoders/page', index)
  }

  const clear = (updateDevice = true) => {
    state.pages.forEach((v) => v.clear())
    if (updateDevice) patch.update()
  }

  return {
    ...toRefs(state),
    get,
    getMapped,
    serialize,
    restore,
    map,
    unmap,
    clear,
    selectPage,
  }
})
