import type { Module, Optional } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDevice } from './device'

type Id = Module['id']

export const useModules = defineStore('module-instances', () => {
  const items = ref(new Map<Id, Module>())
  const nextId = ref(1) // We use a one-based index to be consistent with lua.
  const device = useDevice()

  const add = (module: Optional<Module, 'id'>) => {
    module.id ??= nextId.value++
    items.value.set(module.id, module as Module)
    device.update('/modules/add', [module.type, module.id])
    return module as Module
  }

  const remove = (id: Id) => {
    const instance = items.value.get(id)
    items.value.delete(id)
    device.update('/modules/remove', [id])
    return instance
  }

  return { items, add, remove }
})
