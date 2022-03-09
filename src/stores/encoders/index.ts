import { useLoa } from '@/services/loa'
import { usePatch } from '@/stores/patch'
import { Encoder, EncoderPageSerialized } from '@/types/Encoders'
import { ModuleInstance } from '@/types/ModuleInstance'
import { range } from '@/utils'
import { defineStore } from 'pinia'
import { computed, reactive, toRefs } from 'vue'
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
    state.pages = serializedPages.map(deserializeEncoderPage)
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
    if (updateDevice) loa.sendMessage('/mapping/page', index)
  }

  return {
    ...toRefs(state),
    get,
    getMapped,
    serialize,
    restore,
    map,
    unmap,
    selectPage,
  }
})
