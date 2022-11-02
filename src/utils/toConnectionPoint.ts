import type { ConnectionPoint, Module, Signal } from '@/types'

export const toConnectionPoint = (
  { definition, id: moduleId }: Module,
  index: number,
  direction: 'in' | 'out'
): ConnectionPoint => {
  const category = direction === 'in' ? 'inputs' : 'outputs'
  const { signal } = definition[category][index] ?? {}

  if (!signal) {
    const connector = `${direction === 'in' ? 'input' : 'output'}#${index}}`
    throw new Error(
      `${connector} doesn't exist on definition '${definition.id}'`
    )
  }

  const { shape } = definition
  const { positions } = shape[category][index] ?? {}

  if (!positions) {
    const connector = `${direction === 'in' ? 'input' : 'output'}#${index}}`
    throw new Error(`${connector} doesn't exist on shape '${shape.id}'`)
  }

  const { inset, outline } = positions
  const position = signal === 'midi' ? inset : outline ?? inset
  return {
    signal,
    moduleId,
    direction,
    index,
    position,
  }
}
