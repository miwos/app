import { useLoa } from '@/services/loa'
import { useInstances } from '@/stores/instances'
import { Module } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { nameWithoutExt } from '@/utils'
import Fuse from 'fuse.js'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { getInfo } from './utils'

type Id = Module['id']
type InstanceId = ModuleInstance['id']

const componentImports = import.meta.globEager('../../modules/*.vue')
const components = new Map<Module['id'], string>(
  Object.entries(componentImports).map(([path]) => {
    const id = path.match(/\/([^/.]+)\.(.+)$/)![1]
    return [id, `${id}.vue`]
  })
)

let fuse: Fuse<string> | undefined
const updateFuse = (keys: string[]) => {
  fuse = new Fuse(keys, { minMatchCharLength: 2 })
}

export const useModules = defineStore('modules', () => {
  const loa = useLoa()
  const instances = useInstances()

  const state = reactive({
    // Once the modules are imported they won't change during runtime.
    items: new Map<Id, Module>(),
  })

  // Getters
  const get = (id: Id) => {
    const module = state.items.get(id)
    if (!module) throw new Error(`Can't find module with id '${id}'`)
    return module
  }

  const getByInstanceId = (id: InstanceId) => get(instances.get(id).moduleId)

  const search = (pattern: string): Module[] =>
    fuse?.search(pattern).map(({ item }) => get(item)) ?? []

  // Actions
  const add = (module: Module) => state.items.set(module.id, module)

  const updateInfo = async (moduleId: Module['id']) => {
    const info = await getInfo(moduleId)
    const item = get(moduleId)
    state.items.set(moduleId, { ...item, ...info })
  }

  const loadFromDevice = async () => {
    const dirList = await loa.readDirectory('lua/modules')
    for (const file of dirList) {
      const moduleId = nameWithoutExt(file)
      const info = await getInfo(moduleId)
      add({
        id: moduleId,
        component: components.get(moduleId),
        ...info,
      })
    }
    updateFuse(Array.from(state.items.keys()))
  }

  return {
    ...toRefs(state),
    get,
    getByInstanceId,
    search,
    add,
    updateInfo,
    loadFromDevice,
  }
})
