import { usePatch } from '@/stores/patch'
import { Module } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { debounce } from '@/utils'

export const updatePatchDebounced = debounce(() => {
  usePatch().update()
}, 1000)

export const createInstance = (
  data: Omit<ModuleInstance, 'activeInputOutputIds' | 'isUpdating'>
): ModuleInstance => ({
  ...data,
  activeInputOutputIds: new Set(),
  isUpdating: false,
})

export const getPropsDefaults = (props: Module['props']) =>
  new Map(
    Array.from(props.entries()).map(([name, prop]) => [
      name,
      prop.default ?? prop.min ?? 0,
    ])
  )
