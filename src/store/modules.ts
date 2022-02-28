import { defineStore } from 'pinia'
import { Module } from '@/types/Module'
import Fuse from 'fuse.js'
import { useBridge } from '@/services/bridge'
import { nameWithoutExt } from '@/utils'

const componentImports = import.meta.globEager('../modules/*.vue')
const components: Record<Module['id'], string> = Object.fromEntries(
  Object.entries(componentImports).map(([path]) => {
    const id = path.match(/\/([^/]+)\.(.+)$/)![1]
    return [id, path]
  })
)

let fuse: Fuse<string> | undefined
const updateFuse = (keys: string[]) => {
  fuse = new Fuse(keys, { minMatchCharLength: 2 })
}

export const useModules = defineStore('modules', {
  state: () => ({
    // Once the modules are imported they won't change during runtime.
    items: {} as Record<Module['id'], Module>,
  }),

  getters: {
    get: (state) => (id: Module['id']) => {
      const module = state.items[id]
      if (!module) throw new Error(`Can't find module with id '${id}'`)
      return module
    },

    search:
      (state) =>
      (pattern: string): Module[] =>
        fuse?.search(pattern).map(({ item }) => state.items[item]) ?? [],
  },

  actions: {
    async loadFromDevice() {
      const bridge = useBridge()
      const dirList = await bridge.loa.readDirectory('lua/modules')
      for (const file of dirList) {
        const moduleId = nameWithoutExt(file)
        const response = await bridge.osc.sendRequest('/module/info', [
          moduleId,
        ])

        const info = JSON.parse(response)
        const shapeId = info.shape ?? 'Round'
        delete info.shape

        this.items[moduleId] = {
          id: moduleId,
          shapeId,
          component: components[moduleId],
          ...info,
        }
      }
      updateFuse(Object.keys(this.items))
    },
  },
})
