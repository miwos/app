import { parseSVG, type Shape } from '@miwos/shape'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import inputShape from '@/assets/shapes/Input.svg'
import outputShape from '@/assets/shapes/Output.svg'
import type { Module } from '@/types'
import { useModuleDefinitions } from './moduleDefinitions'

type Id = Shape['id']

export const useModuleShapes = defineStore('module shapes', () => {
  const items = ref(
    new Map<string, Shape>([
      ['Input', { id: 'Input', ...parseSVG(inputShape) }],
      ['Output', { id: 'Output', ...parseSVG(outputShape) }],
    ])
  )

  const definitions = useModuleDefinitions()

  // Getters
  const get = (id: Id) => {
    const item = items.value.get(id)
    if (!item) {
      console.warn(`shape '${id}' not found`)
      return
    }
    return item
  }

  const getByModule = (module: Module) => {
    const definition = definitions.get(module.definition)
    return definition ? items.value.get(definition.shape) : undefined
  }

  const getConnector = (id: Id, index: number, direction: 'in' | 'out') => {
    const item = get(id)
    if (!item) return

    const connector =
      direction === 'in' ? item.inputs[index] : item.outputs[index]
    if (!connector) {
      const name = `${direction === 'in' ? 'input' : 'output'}#${index}`
      console.warn(`${name} not found in shape '${item.id}'`)
      return
    }

    return connector
  }

  return { items, get, getByModule, getConnector }
})
