import { useLoa } from '@/services/loa'
import { Module, ModuleInputOutput } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { nameWithoutExt } from '@/utils'
import Fuse from 'fuse.js'
import { defineStore } from 'pinia'
import { useInstances } from './instances'

const parseSignal = (index: number): ModuleInputOutput['signal'] =>
  index === 1 ? 'midi' : 'trigger'
const parseDirection = (index: number): ModuleInputOutput['direction'] =>
  index === 1 ? 'in' : 'out'

const getInfo = async (moduleId: Module['id']) => {
  const response = await useLoa().sendRequest('/module/info', [moduleId])

  const info = JSON.parse(response)
  const shapeId = (info.shape ?? 'Round') as Module['shapeId']
  const props = info.props as Module['props']

  const inputsOutputs: Module['inputsOutputs'] = Object.fromEntries(
    Object.values(info.inputsOutputs ?? {}).map((v: any) => {
      const direction = parseDirection(v.direction)
      const signal = parseSignal(v.signal)
      const { index } = v
      const id = `${direction}-${index}` as ModuleInputOutput['id']
      return [id, { id, index, direction, signal }]
    })
  )

  return { shapeId, props, inputsOutputs }
}

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

    getByInstanceId: (state) => (id: ModuleInstance['id']) => {
      const instance = useInstances().get(id)
      return state.items[instance.moduleId]
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

    async updateInfo(moduleId: string) {
      const info = await getInfo(moduleId)
      const item = this.items[moduleId]
      this.items[moduleId] = { ...item, ...info }
    },

    async loadFromDevice() {
      const loa = useLoa()
      const dirList = await loa.readDirectory('lua/modules')
      for (const file of dirList) {
        const moduleId = nameWithoutExt(file)
        const info = await getInfo(moduleId)
        this.items[moduleId] = {
          id: moduleId,
          component: components[moduleId],
          ...info,
        }
      }
      updateFuse(Object.keys(this.items))
    },
  },
})
