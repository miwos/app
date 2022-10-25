import { useBridge } from '@/bridge'
import type {
  Connection,
  ConnectionPoint,
  ConnectionSerialized,
} from '@/types/Connection'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDevice } from './device'

type Id = Connection['id']

export const serializeConnection = ({
  from,
  to,
}: Connection): ConnectionSerialized => [
  from.moduleInstanceId,
  from.index + 1, // one-based index
  to.moduleInstanceId,
  to.index + 1, // one-based index
]

export const useConnections = defineStore('connections', () => {
  const items = ref(new Map<Id, Connection>())
  const device = useDevice()

  // Actions
  const add = (from: ConnectionPoint, to: ConnectionPoint) => {
    const id = `${from.id}-${to.id}` as const
    items.value.set(id, { id, from, to })
    device.update('/connections/add', [
      from.moduleInstanceId,
      from.index,
      to.moduleInstanceId,
      to.index,
    ])
    return id
  }

  const remove = (id: Id) => {
    const connection = items.value.get(id)
    items.value.delete(id)
    if (connection) {
      const { from, to } = connection
      device.update('/connections/remove', [
        from.moduleInstanceId,
        from.index,
        to.moduleInstanceId,
        to.index,
      ])
    }
    return connection
  }

  return { items, add, remove }
})
