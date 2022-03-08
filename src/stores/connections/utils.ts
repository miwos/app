import { ConnectionPoint } from '@/types/Connection'
import { useInstances } from '../instances'

export const getConnectionId = (from: ConnectionPoint, to: ConnectionPoint) =>
  `(${from.instanceId},${from.index})-(${to.instanceId},${to.index})`

export const sortPointsByPosition = (
  a: ConnectionPoint,
  b: ConnectionPoint
) => {
  const instances = useInstances()
  const positionA = instances.get(a.instanceId).position
  const positionB = instances.get(b.instanceId).position
  return positionA.y < positionB.y ? [a, b] : [b, a]
}

export const asDirection = (
  point: ConnectionPoint,
  direction: ConnectionPoint['direction']
): ConnectionPoint => ({
  ...point,
  direction,
  id: `${direction}-${point.index}`,
})

export const asInput = (point: ConnectionPoint): ConnectionPoint =>
  point.isInOut ? asDirection(point, 'in') : point

export const asOutput = (point: ConnectionPoint): ConnectionPoint =>
  point.isInOut ? asDirection(point, 'out') : point

export const pointsCanConnect = (a: ConnectionPoint, b: ConnectionPoint) => {
  const haveDifferentInstance = a.instanceId !== b.instanceId
  const haveSameSignals = a.signal === b.signal
  const haveCompatibleDirections =
    a.direction != b.direction || a.isInOut || b.isInOut

  return haveDifferentInstance && haveSameSignals && haveCompatibleDirections
}
