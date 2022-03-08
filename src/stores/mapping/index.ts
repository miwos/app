import { useLoa } from '@/services/loa'
import { usePatch } from '@/stores/patch'
import { Encoder, Mapping } from '@/types/Mapping'
import { range } from '@/utils'
import { defineStore } from 'pinia'
import { computed, reactive, toRefs } from 'vue'
import { createPage, isMappedTo } from './utils'

export const useMapping = defineStore('mapping', () => {
  const loa = useLoa()
  const patch = usePatch()

  const state = reactive({
    currentPageIndex: 0,
    pages: range(3).map(() => createPage(3)) as Mapping,
  })

  loa.on('/mapping/page', ({ args: [index] }) => selectPage((index = 1), false))

  loa.on(
    '/encoder/value',
    ({ args: [id, value] }) => (getEncoder(id).value = value)
  )

  // Getters
  const currentPage = computed(() => state.pages[state.currentPageIndex])

  const getEncoder = (id: Encoder['id']) => {
    const encoder = currentPage.value.encoders.get(id)
    if (!encoder) throw new Error(`Can't find encoder with id '${id}'`)
    return encoder
  }

  const getMappedEncoder = (instanceId: number, propName: string) =>
    computed(() => {
      const encoders = Array.from(currentPage.value.encoders.values())
      return encoders.find((encoder) =>
        isMappedTo(encoder, instanceId, propName)
      )
    })

  // Actions
  const mapEncoder = (
    id: Encoder['id'],
    instanceId: number,
    propName: string
  ) => {
    // First check if the property was already mapped to a different encoder.
    const encoders = Array.from(currentPage.value.encoders.values())
    const prevEncoder = encoders.find((encoder) =>
      isMappedTo(encoder, instanceId, propName)
    )
    if (prevEncoder) clearEncoder(prevEncoder.id)

    getEncoder(id).mappedTo = { instanceId, propName }
    patch.update()
  }

  const clearEncoder = (id: Encoder['id']) =>
    (getEncoder(id).mappedTo = undefined)

  const selectPage = (index: number, updateDevice = true) => {
    state.currentPageIndex = index
    if (updateDevice) loa.sendMessage('/mapping/page', index)
  }

  return {
    ...toRefs(state),
    getEncoder,
    getMappedEncoder,
    mapEncoder,
    clearEncoder,
    selectPage,
  }
})
