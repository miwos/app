import { useEncoders } from '@/stores/encoders'
import { Encoder } from '@/types/Encoders'
import { ModuleInstance } from '@/types/ModuleInstance'
import { pushCommand } from '.'

export const mapEncoder = (
  pageIndex: number,
  id: Encoder['id'],
  instanceId: ModuleInstance['id'],
  propName: string
) => {
  const encoders = useEncoders()
  pushCommand('map encoder', () => {
    encoders.map(pageIndex, id, instanceId, propName)
    return () => encoders.unmap(pageIndex, id)
  })
}
