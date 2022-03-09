import { ConnectionPoint } from '@/types/Connection'

export const connectionPointsAreEqual = (
  a: ConnectionPoint,
  b: ConnectionPoint
) =>
  a.instanceId === b.instanceId &&
  a.index === b.index &&
  a.direction === b.direction
