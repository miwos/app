import { Module, ModuleSerialized } from '@/types/Module'

export const serializeModule = (module: Module) => ({
  ...module,
  props: Array.from(module.props.values()),
})

export const deserializeModule = (serialized: ModuleSerialized): Module => ({
  ...serialized,
  props: new Map(serialized.props.map((v) => [v.name, v])),
})
