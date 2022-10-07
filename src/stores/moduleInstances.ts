import { useBridge } from '@/bridge'
import type { Module } from '@/types/Module'
import type { ModuleInstance } from '@/types/ModuleInstance'
import type { Point } from '@/types/Point'
import { defineStore } from 'pinia'
import { ref } from 'vue'

type Id = ModuleInstance['id']

export const useModuleInstances = defineStore('module-instances', () => {
  const items = ref(new Map<Id, ModuleInstance>())
  const nextId = ref(1) // We use a one-based index to be consistent with lua.
  const bridge = useBridge()

  const add = (moduleId: Module['id'], position: Point) => {
    const id = nextId.value++
    items.value.set(id, { id, moduleId, position })
    bridge.request('/engine/addModule', [id])
  }

  return { items, add }
})
