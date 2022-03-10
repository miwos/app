import { usePatch } from '@/stores/patch'
import { Module } from '@/types/Module'
import {
  ModuleInstance,
  ModuleInstanceSerialized,
} from '@/types/ModuleInstance'
import { debounce } from '@/utils'

export const updatePatchDebounced = debounce(() => {
  usePatch().update()
}, 1000)

export const createInstance = (
  data: Omit<ModuleInstance, 'isUpdating'>
): ModuleInstance => ({
  ...data,
  isUpdating: false,
})

export const serializeInstance = (
  instance: ModuleInstance
): ModuleInstanceSerialized => {
  const {
    moduleId,
    position: { x, y },
  } = instance
  const props = Object.fromEntries(instance.props.entries())
  return { Module: moduleId, xy: [x, y], props }
}

export const deserializeInstance = (
  serialized: ModuleInstanceSerialized
): Pick<ModuleInstance, 'moduleId' | 'position' | 'props'> => {
  const {
    Module,
    xy: [x, y],
  } = serialized
  const props = new Map(Object.entries(serialized.props))
  return { moduleId: Module, position: { x, y }, props }
}

export const getPropsDefaults = (props: Module['props']) =>
  new Map(
    Array.from(props.entries()).map(([name, prop]) => [
      name,
      prop.default ?? prop.min ?? 0,
    ])
  )
