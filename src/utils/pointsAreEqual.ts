import { ConnectionPoint } from '@/types/Connection'

export const pointsAreEqual = (a: ConnectionPoint, b: ConnectionPoint) =>
  a.instanceId === b.instanceId && a.id === b.id
