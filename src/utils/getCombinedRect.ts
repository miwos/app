import type { Rect } from '@/types'

export const getCombinedRect = (rects: Rect[]) => {
  if (!rects.length) throw new Error('expected at least one rect')

  let rect = rects[0]
  if (rects.length === 1) return rect

  for (let i = 1; i < rects.length; i++) {
    const { x, y, width, height } = rects[i]
    rect.x = Math.min(rect.x, x)
    rect.y = Math.min(rect.y, y)
    rect.width = Math.max(rect.width, x + width - Math.min(rect.x, x))
    rect.height = Math.max(rect.height, y + height - Math.min(rect.y, y))
  }
  return rect
}
