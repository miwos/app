import { useConnections } from '@/stores/connections'
import { useEncoders } from '../encoders'
import { useInstances } from '../instances'

export const serializePatch = () => {
  const instances = useInstances().serialize()
  const connections = useConnections().serialize()
  const encoders = useEncoders().serialize()
  return { instances, connections, encoders }
}
