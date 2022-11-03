import { useModuleDefinitions } from '@/stores/moduleDefinitions'
import { useModules } from '@/stores/modules'
import { useModuleShapes } from '@/stores/moduleShapes'
import type { ConnectionPoint, Module, Point } from '@/types'

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

export const getConnectionPointPosition = (
  moduleId: Module['id'],
  index: number,
  direction: 'in' | 'out'
): Point => {
  const module = useModules().get(moduleId)
  if (!module) return { x: 0, y: 0 }
  const connectionPoint = toConnectionPoint(module, index, direction)
  if (!connectionPoint) return { x: 0, y: 0 }

  return {
    x: module.position.x + connectionPoint.position.x,
    y: module.position.y + connectionPoint.position.y,
  }
}
