import type { Module } from '@/types/Module'
import Fuse from 'fuse.js'
import { defineStore } from 'pinia'
import { reactive, ref, toRefs } from 'vue'

let fuse: Fuse<string> | undefined
const indexSearch = (keys: string[]) => {
  fuse = new Fuse(keys, { minMatchCharLength: 2 })
}

export const useModules = defineStore('modules', () => {
  const items = ref(
    new Map<Module['id'], Module>([
      ['Input', { id: 'Input' }],
      ['Output', { id: 'Output' }],
      ['Module1', { id: 'Module1' }],
      ['Module2', { id: 'Module2' }],
      ['Module3', { id: 'Module3' }],
      ['Module4', { id: 'Module4' }],
      ['Module5', { id: 'Module5' }],
      ['Module6', { id: 'Module6' }],
    ])
  )

  indexSearch(Array.from(items.value.keys()))

  const search = (query: string): Module[] =>
    fuse?.search(query).map(({ item: id }) => items.value.get(id)!) ?? []

  return { items, search }
})
