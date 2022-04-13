import { usePatch } from '@/stores/patch'
import { serializePatch } from '@/stores/patch/utils'
import { PatchSerialized } from '@/types/Patch'
import { pushCommand } from '.'

export const clearPatch = () => {
  const patch = usePatch()
  let restore: PatchSerialized
  pushCommand('clear', () => {
    restore = serializePatch()
    patch.clear()
    return () => patch.restore(restore)
  })
}
