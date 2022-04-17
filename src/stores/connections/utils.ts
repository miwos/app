import {
  Connection,
  ConnectionPoint,
  ConnectionSerialized,
} from '@/types/Connection'
import { useInstances } from '../instances'
import { useModules } from '../modules'

export const getConnectionId = (
  from: ConnectionPoint,
  to: ConnectionPoint
): Connection['id'] => `(${from.id})-(${to.id})`

export const serializeConnection = ({
  from,
  to,
}: Connection): ConnectionSerialized => [
  from.instanceId,
  from.index + 1, // one-based index
  to.instanceId,
  to.index + 1, // one-based index
]

export const deserializeConnection = ([
  fromId,
  fromIndex,
  toId,
  toIndex,
]: ConnectionSerialized): Pick<Connection, 'from' | 'to'> => {
  const from = deserializeConnectionPoint('out', fromId, fromIndex - 1) // zero-based index
  const to = deserializeConnectionPoint('in', toId, toIndex - 1) // zero-based index
  return { from, to }
}

export const deserializeConnectionPoint = (
  direction: ConnectionPoint['direction'],
  instanceId: ConnectionPoint['instanceId'],
  index: ConnectionPoint['index']
): ConnectionPoint => {
  const id = `${instanceId}-${index}` as ConnectionPoint['id']
  const module = useModules().getByInstanceId(instanceId)
  const signal =
    direction === 'in'
      ? module.inputs[index].signal
      : module.outputs[index].signal
  return { id, index, instanceId, direction, signal }
}

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
