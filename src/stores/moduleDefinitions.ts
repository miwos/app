import type {
  ModuleDefinition,
  ModuleDefinitionSerialized,
  Signal,
} from '@/types'
import { luaToJson } from '@/utils'
import Fuse from 'fuse.js'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDevice } from './device'
import { useModuleShapes } from './moduleShapes'

type Id = ModuleDefinition['id']

let fuse: Fuse<string> | undefined
const indexSearch = (keys: string[]) => {
  fuse = new Fuse(keys, { minMatchCharLength: 2 })
}

export const useModuleDefinitions = defineStore('module definitions', () => {
  const items = ref(new Map<Id, ModuleDefinition>())

  const shapes = useModuleShapes()
  const device = useDevice()
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

    const moduleConnector =
      direction === 'in' ? item.inputs[index] : item.outputs[index]
    if (!moduleConnector) {
      const name = `${direction === 'in' ? 'input' : 'output'} #${index}`
      console.warn(`${name} not found in module definition '${item.id}'`)
      return
    }

    const shapeConnector = shapes.getConnector(item.shape, index, direction)
    if (!shapeConnector) return

    return { ...moduleConnector, ...shapeConnector }
  }

  // Actions
  const search = (query: string): ModuleDefinition[] =>
    fuse?.search(query).map(({ item: id }) => items.value.get(id)!) ?? []

  const deserialize = (serialized: ModuleDefinitionSerialized[]) => {
    for (const serializedDefinition of serialized) {
      const { shape, id, inputs, outputs } = serializedDefinition
      items.value.set(id, {
        ...serializedDefinition,
        inputs: inputs?.map((signal) => ({ signal })) ?? [],
        outputs: outputs?.map((signal) => ({ signal })) ?? [],
        shape: shape ?? id,
      })
    }
  }

  const loadFromDevice = async () => {
    const result = await device.request('/e/modules/definitions')
    if (!result) return

    items.value.clear()
    deserialize(<ModuleDefinitionSerialized[]>luaToJson(result))
    indexSearch(Array.from(items.value.keys()))
  }

  return { items, get, getConnector, search, loadFromDevice }
})
