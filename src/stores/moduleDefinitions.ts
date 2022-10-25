import type { ModuleDefinition } from '@/types'
import Fuse from 'fuse.js'
import { defineStore } from 'pinia'
import { ref } from 'vue'

let fuse: Fuse<string> | undefined
const indexSearch = (keys: string[]) => {
  fuse = new Fuse(keys, { minMatchCharLength: 2 })
}

export const useModuleDefinitions = defineStore('module definitions', () => {
  const items = ref(
    new Map<ModuleDefinition['id'], ModuleDefinition>([
      ['Input', { id: 'Input', inputs: [], outputs: [{ signal: 'midi' }] }],
      ['Output', { id: 'Output', inputs: [{ signal: 'midi' }], outputs: [] }],
    ])
  )

  indexSearch(Array.from(items.value.keys()))

  const search = (query: string): ModuleDefinition[] =>
    fuse?.search(query).map(({ item: id }) => items.value.get(id)!) ?? []

  return { items, search }
})
