import { useLoa } from '@/services/loa'
import { useInstances } from '@/stores/instances'
import { Module, ModuleSerialized } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { nameWithoutExt } from '@/utils'
import Fuse from 'fuse.js'
// @ts-ignore
import * as luaJson from 'lua-json'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { deserializeModule } from './utils'
import modulesSerialized from '@/modules.json'

type Id = Module['id']
type InstanceId = ModuleInstance['id']

const items = new Map<Id, Module>(
  modulesSerialized.map((v) => [v.id, deserializeModule(v as ModuleSerialized)])
)

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

  const state = reactive({ items })
  updateFuse(Array.from(state.items.keys()))

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

  const updateFromDevice = async (id: Module['id']) => {
    const response = await useLoa().sendRequest('/module/info', [id])
    const serialized = luaJson.parse(`return ${response}`)
    const data = deserializeModule(serialized)
    state.items.set(id, { ...data, id, component: components.get(id) })
  }

  const restoreAllFromDevice = async () => {
    const dirList = await loa.readDirectory('lua/modules')
    for (const file of dirList) {
      await updateFromDevice(nameWithoutExt(file))
    }
    updateFuse(Array.from(state.items.keys()))
  }

  return {
    ...toRefs(state),
    get,
    getByInstanceId,
    search,
    add,
    updateFromDevice,
    restoreAllFromDevice,
  }
})
