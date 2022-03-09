import {
  Encoder,
  EncoderPage,
  EncoderPageSerialized,
  EncoderSerialized,
} from '@/types/Encoders'
import { ModuleInstance } from '@/types/ModuleInstance'

export const serializeEncoderPage = (
  page: EncoderPage
): EncoderPageSerialized =>
  Object.fromEntries(
    Array.from(page.values()).map((v) => [v.id, serializeEncoder(v)])
  )

export const serializeEncoder = ({
  instanceId,
  propName,
}: Encoder): EncoderSerialized => [instanceId, propName]

export const deserializeEncoderPage = (serialized: EncoderPageSerialized) =>
  new Map(
    Object.entries(serialized).map(([id, v]) => [
      +id,
      deserializeEncoder(+id, v),
    ])
  )

export const deserializeEncoder = (
  id: Encoder['id'],
  [instanceId, propName]: EncoderSerialized
): Encoder => ({
  id,
  instanceId,
  propName,
})

export const isMappedTo = (
  encoder: Encoder,
  instanceId: ModuleInstance['id'],
  propName: string
) => encoder.instanceId === instanceId && encoder.propName === propName
