import { useModuleDefinitions } from '@/stores/moduleDefinitions'
import { useModuleShapes } from '@/stores/moduleShapes'
import type { ConnectionPoint, Module, Signal } from '@/types'

export const toConnectionPoint = (
  module: Module,
  index: number,
  direction: 'in' | 'out'
): ConnectionPoint | undefined => {
  const definitions = useModuleDefinitions()
  const shapes = useModuleShapes()

  const definition = definitions.get(module.definition)
  if (!definition) return

  const { signal } =
    definitions.getConnector(module.definition, index, direction) ?? {}
  if (!signal) return

  const { positions } =
    shapes.getConnector(definition.shape, index, direction) ?? {}
  if (!positions) return

  const { inset, outline } = positions
  const position = signal === 'midi' ? inset : outline ?? inset
  return { signal, moduleId: module.id, direction, index, position }
}
