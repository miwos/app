import type { ModuleDefinition, ModuleDefinitionNormalized } from '@/types'
import { resolveRelations } from '@/utils'
import Fuse from 'fuse.js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useModuleShapes } from './moduleShapes'

type Id = ModuleDefinition['id']

let fuse: Fuse<string> | undefined
const indexSearch = (keys: string[]) => {
  fuse = new Fuse(keys, { minMatchCharLength: 2 })
}

export const useModuleDefinitions = defineStore('module definitions', () => {
  const items = ref(
    new Map<Id, ModuleDefinitionNormalized>([
      [
        'Input',
        {
          id: 'Input',
          shape: 'Input',
          inputs: [],
          outputs: [{ signal: 'midi' }],
        },
      ],
      [
        'Output',
        {
          id: 'Output',
          shape: 'Output',
          inputs: [{ signal: 'midi' }],
          outputs: [],
        },
      ],
    ])
  )

  const shapes = useModuleShapes()
  indexSearch(Array.from(items.value.keys()))

  // Getters
  const get = (id: Id): ModuleDefinition | undefined => {
    const item = items.value.get(id)
    if (!item) return
    return resolveRelations(item, { shape: shapes })
  }

  const list = computed(() => Array.from(items.value.keys()).map(get))

  // Actions
  const search = (query: string): ModuleDefinition[] =>
    fuse?.search(query).map(({ item: id }) => get(id)!) ?? []

  return { items, get, list, search }
})
