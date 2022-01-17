import { Handle, HandleId } from '@/store/shapes'

export const getHandleId = (type: Handle['type'], index: number): HandleId =>
  `${type}-${index}`
