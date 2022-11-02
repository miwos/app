import type {
  Module,
  ModuleNormalized,
  ModuleSerialized,
  Optional,
} from '@/types'
import { resolveRelations } from '@/utils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDevice } from './device'
import { useModuleDefinitions } from './moduleDefinitions'

type Id = Module['id']

export const serializeModule = (
  module: ModuleNormalized
): ModuleSerialized => ({
  ...module,
  position: [module.position.x, module.position.y],
})

export const deserializeModule = (
  serialized: ModuleSerialized
): ModuleNormalized => ({
  ...serialized,
  position: { x: serialized.position[0], y: serialized.position[1] },
})

export const useModules = defineStore('module-instances', () => {
  const items = ref(new Map<Id, ModuleNormalized>())
  const nextId = ref(1) // We use a one-based index to be consistent with lua.
  const device = useDevice()
  const definitions = useModuleDefinitions()

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

  const add = (
    module: Optional<ModuleNormalized, 'id'>,
    updateDevice = true
  ) => {
    module.id ??= nextId.value++
    items.value.set(module.id, module as ModuleNormalized)
    if (updateDevice)
      device.update('/e/modules/add', [module.definition, module.id])
    return module as ModuleNormalized
  }

  const remove = (id: Id) => {
    const module = items.value.get(id)
    items.value.delete(id)
    device.update('/e/modules/remove', [id])
    return module
  }

  const update = <T extends keyof ModuleNormalized>(
    id: Id,
    key: T,
    value: ModuleNormalized[T]
  ) => {
    const item = items.value.get(id)
    if (item) item[key] = value
  }

  const clear = () => items.value.clear()

  // Getters
  const get = (id: Id): Module | undefined => {
    const item = items.value.get(id)
    if (!item) return
    return resolveRelations(item, { definition: definitions })
  }

  const list = computed(() =>
    Array.from(items.value.keys()).map((id) => get(id)!)
  )

  return {
    items,
    get,
    list,
    serialize,
    deserialize,
    add,
    update,
    remove,
    clear,
  }
})
