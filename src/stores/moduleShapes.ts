import { parseSVG, type Shape } from '@miwos/shape'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import inputShape from '@/assets/shapes/Input.svg'
import outputShape from '@/assets/shapes/Output.svg'

export const useModuleShapes = defineStore('module shapes', () => {
  const items = ref(
    new Map<string, Shape>([
      ['Input', { id: 'Input', ...parseSVG(inputShape) }],
      ['Output', { id: 'Output', ...parseSVG(outputShape) }],
    ])
  )

  // Getters
  const get = (id: string) => items.value.get(id)
  const list = computed(() => items.value.values())

  return { items, get, list }
})
