import { usePatch } from '@/stores/patch'
import { Module } from '@/types/Module'
import {
  ModuleInstance,
  ModuleInstanceSerialized,
} from '@/types/ModuleInstance'
import { debounce, isObject } from '@/utils'

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
  const props = Object.fromEntries(
    Array.from(instance.props.entries()).map(([name, v]) => [
      name,
      Object.keys(v).length === 1 ? v.value : v,
    ])
  )
  return { Module: moduleId, xy: [x, y], props }
}

export const deserializeInstance = (
  serialized: ModuleInstanceSerialized
): Pick<ModuleInstance, 'moduleId' | 'position' | 'props'> => {
  const {
    Module,
    xy: [x, y],
  } = serialized
  // As a shorthand we also allow `propName: value` instead of
  // `propName: { value }`.
  const props = new Map(
    Object.entries(serialized.props).map(([name, v]) => [
      name,
      isObject(v) ? v : { value: v },
    ])
  )

  return { moduleId: Module, position: { x, y }, props }
}

export const getDefaultProps = (
  props: Module['props']
): ModuleInstance['props'] =>
  new Map(
    Array.from(props.entries()).map(([name, prop]) => [
      name,
      { value: prop.default ?? prop.min ?? 0 },
    ])
  )
