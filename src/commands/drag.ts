import { useModules } from '@/stores/modules'
import type { Module, Point, Rect } from '@/types'
import { getCombinedRect } from '@/utils'
import { pushCommand } from '.'

const prevModulePositions = new Map<Module['id'], Point>()
const modulePositions = new Map<Module['id'], Point>()
const moduleDeltas = new Map<Module['id'], Point>()

let groupRect: Rect | undefined
let groupDelta: Point | undefined
let group: Module[] = []

export const startDrag = (modules: Module[], point: Point) => {
  group = modules

  // Conceptually we do not move the individual modules but the whole group. So
  // we use the groups rectangle and it's corresponding delta.
  groupRect = getCombinedRect(
    Array.from(group.values()).map(({ position, size }) => ({
      ...position,
      ...size!,
    }))
  )
  groupDelta = { x: point.x - groupRect.x, y: point.y - groupRect.y }

  for (const { id, position } of group) {
    // Store the original positions, so we can undo the drag again.
    prevModulePositions.set(id, { x: position.x, y: position.y })
    // Store individual deltas relative to the group's rectangle, so we can
    // figure out the individual positions while dragging.
    moduleDeltas.set(id, {
      x: position.x - groupRect.x,
      y: position.y - groupRect.y,
    })
  }
}

export const drag = (point: Point) => {
  if (!groupRect || !groupDelta) return

  let x = point.x - groupDelta.x
  let y = point.y - groupDelta.y
  const { width, height } = groupRect

  // Make sure the group won't leave the window.
  if (x < 0) x = 0
  else if (x + width > window.innerWidth) x = window.innerWidth - width

  if (y < 0) y = 0
  else if (y + height > window.innerHeight) y = window.innerHeight - height

  for (const module of group) {
    const delta = moduleDeltas.get(module.id)
    if (!delta) continue
    module.position = { x: x + delta.x, y: y + delta.y }
    modulePositions.set(module.id, { ...module.position })
  }
}

export const cancelDrag = () => {
  group = []
  const modules = useModules()
  for (const [id, { x, y }] of prevModulePositions) {
    const module = modules.get(id)
    if (module) module.position = { x, y }
  }
}

export const endDrag = () => {
  group = []
  const modules = useModules()
  let positions = new Map<Module['id'], Point>()
  let prevPositions = new Map<Module['id'], Point>()

  pushCommand('drag modules', () => {
    prevPositions = new Map(prevModulePositions)
    positions = new Map(modulePositions)

    // The moment we call `endDrag()`, the positions are already set. But we
    // have to set them anyway so redo will be working correctly.
    for (const [id, { x, y }] of positions) {
      const module = modules.get(id)
      if (module) module.position = { x, y }
    }

    return () => {
      for (const [id, { x, y }] of prevPositions) {
        const module = modules.get(id)
        if (module) module.position = { x, y }
      }
    }
  })
}
