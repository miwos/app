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
