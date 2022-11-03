import type { ModuleDefinition } from '@/types'
import Fuse from 'fuse.js'
import { defineStore } from 'pinia'
import { ref } from 'vue'

type Id = ModuleDefinition['id']

let fuse: Fuse<string> | undefined
const indexSearch = (keys: string[]) => {
  fuse = new Fuse(keys, { minMatchCharLength: 2 })
}

export const useModuleDefinitions = defineStore('module definitions', () => {
  const items = ref(
    new Map<Id, ModuleDefinition>([
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

  indexSearch(Array.from(items.value.keys()))

  // Getters
  const get = (id: Id) => {
    const item = items.value.get(id)
    if (!item) {
      console.warn(`module definition '${id}' not found`)
      return
    }
    return item
  }

  const getConnector = (id: Id, index: number, direction: 'in' | 'out') => {
    const item = get(id)
    if (!item) return

    const connector =
      direction === 'in' ? item.inputs[index] : item.outputs[index]
    if (!connector) {
      const name = `${direction === 'in' ? 'input' : 'output'} #${index}`
      console.warn(`${name} not found in module definition '${item.id}'`)
      return
    }

    return connector
  }

  // Actions
  const search = (query: string): ModuleDefinition[] =>
    fuse?.search(query).map(({ item: id }) => items.value.get(id)!) ?? []

  return { items, get, getConnector, search }
})
