import { useConnections } from '@/stores/connections'
import { useModules } from '@/stores/modules'
import type { Connection, ConnectionPoint } from '@/types/Connection'
import { pushCommand } from '.'

let startPoint: ConnectionPoint | undefined

const sortPointsByPosition = (a: ConnectionPoint, b: ConnectionPoint) => {
  const modules = useModules()
  const positionA = modules.items.get(a.moduleId)?.position
  const positionB = modules.items.get(b.moduleId)?.position
  if (!positionA || !positionB) return [a, b]
  return positionA.y < positionB.y ? [a, b] : [b, a]
}

export const connectFrom = (point: ConnectionPoint) => (startPoint = point)

export const connectTo = (point: ConnectionPoint) => {
  if (!startPoint) return

  const bothAreThru = point.thru && startPoint.thru

  // Sort the points so our connection will always flow from `out` to
  // `in`. If both points are of the special type `thru` we have to make a guess
  // based on the points positions, treating the higher point as `out` and the
  // lower as `in`. Otherwise we look for a point with a distinct direction
  // (not `thru`) and sort them based an that point.
  const connectionPoints = bothAreThru
    ? sortPointsByPosition(startPoint, point)
    : (!startPoint.thru && startPoint.direction === 'out') ||
      (!point.thru && point.direction === 'in')
    ? [startPoint, point]
    : [point, startPoint]

  const [from, to] = connectionPoints
  startPoint = undefined

  const connections = useConnections()
  let id: Connection['id']
  pushCommand('add connection', () => {
    id = connections.add({ from, to })
    return () => connections.remove(id)
  })
}

export const removeConnection = (id: Connection['id']) => {
  const connections = useConnections()
  let removed: Connection | undefined

  pushCommand('remove connection', () => {
    removed = connections.remove(id)
    return () => removed && connections.add(removed)
  })
}