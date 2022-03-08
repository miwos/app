import { Encoder } from '@/types/Mapping'
import { ModuleInstance } from '@/types/ModuleInstance'
import { range } from '@/utils'

export const createEncoders = (count: number) =>
  new Map(
    range(count).map((i) => {
      const id = i + 1
      return [id, { id, value: 0 }]
    })
  )

export const createPage = (encodersCount: number) => ({
  encoders: createEncoders(encodersCount),
})

export const isMappedTo = (
  { mappedTo }: Encoder,
  instanceId: ModuleInstance['id'],
  propName: string
) =>
  mappedTo &&
  mappedTo.instanceId === instanceId &&
  mappedTo.propName === propName
