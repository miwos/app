import type { Optional, Point } from '@/types'
import type {
  Connection,
  ConnectionSerialized,
  TemporaryConnection,
} from '@/types/Connection'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDevice } from './device'
import { useModules } from './modules'

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
  const tempConnection = ref<TemporaryConnection>()

  const device = useDevice()
  const modules = useModules()

  // Getters
  const get = (id: Id) => {
    const item = items.value.get(id)
    if (!item) {
      console.warn(`connection '${id}' not found`)
      return
    }
    return item
  }

  const sortIndexes = computed(
    () =>
      new Map(
        Array.from(items.value.entries()).map(([id, item]) => {
          // Make sure the line is always above the modules it is connecting.
          const sort = Math.max(
            modules.getSortIndex(item.from.moduleId) ?? 0,
            modules.getSortIndex(item.to.moduleId) ?? 0
          )
          return [id, sort]
        })
      )
  )
  const getSortIndex = (id: Id) => sortIndexes.value.get(id)

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

  return {
    items,
    tempConnection,
    serialize,
    deserialize,
    get,
    getSortIndex,
    add,
    remove,
    clear,
  }
})
