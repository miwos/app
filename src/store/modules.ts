import { useLoa } from '@/services/loa'
import { Module, ModuleInputOutput } from '@/types/Module'
import { nameWithoutExt } from '@/utils'
import Fuse from 'fuse.js'
import { defineStore } from 'pinia'

const parseSignal = (index: number): ModuleInputOutput['signal'] =>
  index === 1 ? 'midi' : 'trigger'
const parseDirection = (index: number): ModuleInputOutput['direction'] =>
  index === 1 ? 'in' : 'out'

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
    add(module: Module) {
      this.items[module.id] = module
    },

    async loadFromDevice() {
      const loa = useLoa()
      const dirList = await loa.readDirectory('lua/modules')
      for (const file of dirList) {
        const moduleId = nameWithoutExt(file)
        const response = await loa.sendRequest('/module/info', [moduleId])

        const info = JSON.parse(response)
        const shapeId = info.shape ?? 'Round'
        const { props } = info

        const inputsOutputs = Object.fromEntries(
          Object.values(info.inputsOutputs ?? {}).map((v: any) => {
            const direction = parseDirection(v.direction)
            const signal = parseSignal(v.signal)
            const { index } = v
            const id = `${direction}-${index}` as ModuleInputOutput['id']
            return [id, { id, index, direction, signal }]
          })
        )

        this.items[moduleId] = {
          id: moduleId,
          shapeId,
          component: components[moduleId],
          props,
          inputsOutputs,
        }
      }
      updateFuse(Object.keys(this.items))
    },
  },
})
