import type { Optional } from '@/types'
import type { Connection, ConnectionSerialized } from '@/types/Connection'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDevice } from './device'

type Id = Connection['id']

export const serializeConnection = ({
  from,
  to,
}: Connection): ConnectionSerialized => [
  from.moduleId,
  from.index,
  to.moduleId,
  to.index,
]

export const deserializeConnection = (
  serialized: ConnectionSerialized
): Connection => {
  const from = { moduleId: serialized[0], index: serialized[1] }
  const to = { moduleId: serialized[2], index: serialized[3] }
  const id =
    `${from.moduleId},${from.index}-${to.moduleId},${to.index}` as const
  return { id, from, to }
}

export const useConnections = defineStore('connections', () => {
  const items = ref(new Map<Id, Connection>())
  const device = useDevice()

  // Getters
  const get = (id: Id) => items.value.get(id)
  const list = computed(() => items.value.values())

  // Actions
  const serialize = (): ConnectionSerialized[] =>
    Array.from(items.value.values()).map(serializeConnection)

  const deserialize = (serialized: ConnectionSerialized[]) => {
    items.value.clear()
    serialized.forEach((v) => add(deserializeConnection(v), false))
  }

  const add = (connection: Optional<Connection, 'id'>, updateDevice = true) => {
    const { from, to } = connection
    connection.id ??=
      `${from.moduleId},${from.index}-${to.moduleId},${to.index}` as const
    items.value.set(connection.id, connection as Connection)
    if (updateDevice) {
      const serialized = serializeConnection(connection as Connection)
      device.update('/e/connections/add', serialized)
    }
    return connection.id
  }

  const remove = (id: Id) => {
    const connection = items.value.get(id)
    items.value.delete(id)
    if (connection)
      device.update('/e/connections/remove', serializeConnection(connection))
    return connection
  }

  const clear = () => items.value.clear()

  return { items, get, list, serialize, deserialize, add, remove, clear }
})
