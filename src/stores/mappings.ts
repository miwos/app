import type { Module } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDevice } from './device'

interface PropMapping {
  slot: number
  moduleId: Module['id']
  prop: string
}

const mappingsEqual = (a: PropMapping, b: PropMapping) =>
  a.slot === b.slot && a.moduleId === b.moduleId && a.prop === b.prop

export const useMappings = defineStore('mappings', () => {
  const pages = ref([
    new Map<PropMapping['slot'], PropMapping>(),
    new Map<PropMapping['slot'], PropMapping>(),
    new Map<PropMapping['slot'], PropMapping>(),
  ])

  const device = useDevice()

  // Actions
  const add = (page: number, mapping: PropMapping, updateDevice = true) => {
    // Remove any previous mappings, because a module prop should only be mapped
    // once at a time.
    pages.value.forEach((page, index) => {
      for (const existingMapping of page.values()) {
        if (mappingsEqual(mapping, existingMapping))
          remove(index, existingMapping.slot)
      }
    })

    pages.value[page].set(mapping.slot, mapping)
    if (updateDevice) {
      device.update('/e/mappings/add', [
        page,
        mapping.slot,
        mapping.moduleId,
        mapping.prop,
      ])
    }
  }

  const remove = (page: number, slot: number, updateDevice = true) => {
    pages.value[page].delete(slot)
    if (updateDevice) device.update('/e/mappings/remove', [page, slot])
  }

  return { pages, add, remove }
})
