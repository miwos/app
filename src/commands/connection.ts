import { useConnections } from '@/stores/connections'
import { Connection, ConnectionPoint } from '@/types/Connection'
import { pushCommand } from '.'

export const createConnection = (
  from: ConnectionPoint,
  to: ConnectionPoint
) => {
  const connections = useConnections()
  let id: Connection['id']
  pushCommand('create connection', () => {
    id = connections.add(from, to)
    return () => connections.remove(id)
  })
}

export const removeConnection = (id: Connection['id']) => {
  const connections = useConnections()
  let removed: Connection | undefined

  pushCommand('remove connection', () => {
    removed = connections.remove(id)
    return () => removed && connections.add(removed.from, removed.to)
  })
}
