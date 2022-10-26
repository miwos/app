import type { Module, ModuleSerialized, Optional } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDevice } from './device'

type Id = Module['id']

export const serializeModule = (module: Module): ModuleSerialized => ({
  ...module,
  position: [module.position.x, module.position.y],
})

export const deserializeModule = (serialized: ModuleSerialized): Module => ({
  ...serialized,
  position: { x: serialized.position[0], y: serialized.position[1] },
})

export const useModules = defineStore('module-instances', () => {
  const items = ref(new Map<Id, Module>())
  const nextId = ref(1) // We use a one-based index to be consistent with lua.
  const device = useDevice()

  // Actions
  const serialize = () => Array.from(items.value.values()).map(serializeModule)

  const deserialize = (serialized: ModuleSerialized[]) => {
    items.value.clear()
    for (const serializedModule of serialized) {
      const module = deserializeModule(serializedModule)
      add(module)
      // Make sure that future module ids won't clash with the currently added
      // module.
      nextId.value = Math.max(nextId.value, module.id + 1)
    }
  }

  const add = (module: Optional<Module, 'id'>, updateDevice = true) => {
    module.id ??= nextId.value++
    items.value.set(module.id, module as Module)
    if (updateDevice) device.update('/e/modules/add', [module.type, module.id])
    return module as Module
  }

  const remove = (id: Id) => {
    const instance = items.value.get(id)
    items.value.delete(id)
    device.update('/e/modules/remove', [id])
    return instance
  }

  return { items, serialize, deserialize, add, remove }
})
