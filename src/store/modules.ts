import { markRaw } from 'vue'
import { defineStore } from 'pinia'
import { Module } from '@/types/Module'

const moduleImports = import.meta.globEager('../modules/*.json')
const modules: Record<Module['id'], Module> = Object.fromEntries(
  Object.values(moduleImports).map((module) => {
    const definition = module.default
    const shapeId = definition.shapeId ?? 'round'
    return [definition.id, { props: {}, ...definition, shapeId }]
  })
)

export const useModules = defineStore({
  id: 'modules',

  state: () => ({
    // Once the modules are imported they won't change during runtime.
    items: markRaw(modules),
  }),

  getters: {
    find: (state) => (id: Module['id']) => {
      const module = state.items[id]
      if (!module) throw new Error(`Can't find module with id '${id}'`)
      return module
    },
  },
})
