import { createHobbyCurve } from 'hobby-curve'
import { computed } from 'vue'

import Vec from 'tiny-vec'
import { toRadians } from '../utils'
import { useModuleInstances } from '@/store/moduleInstances'
import { ConnectionPoint } from '@/types/Connection'

export const useConnectionCurve = (
  from: ConnectionPoint,
  to: ConnectionPoint
) =>
  computed(() => {
    const instances = useModuleInstances()

    const fromInstance = instances.find(from.instanceId)
    const fromHandle = fromInstance.shape.handles[from.id]
    const fromPosition = new Vec(fromInstance.position).add(fromHandle.delta)

    const toInstance = instances.find(to.instanceId)
    const toHandle = toInstance.shape.handles[to.id]
    const toPosition = new Vec(toInstance.position).add(toHandle.delta)

    const delta = new Vec(toPosition).subtract(fromPosition)

    const x = delta.x / 100 + (delta.x > 0 ? 10 : -10)
    const y = Math.abs(delta.y / 10) + 20

    const dx = delta.x / window.innerWidth
    const dy = delta.y / window.innerHeight

    // const factor = Math.abs(dx * 0.2 + (1 - dy) * 0.8) * dx

    // console.log(dx * 0.8 + (1 - dy) * 0.2)

    let { angle: fromAngle } = fromHandle
    if (fromHandle.direction === 'inout') fromAngle += 180
    const { angle: toAngle } = toHandle

    const a = toAngle + 90 - dx * 45
    const p2 = toPosition.add(
      new Vec(0, -1).multiply(20 + Math.abs(dy * 100)).rotate(toRadians(a))
    )

    const b = fromAngle + 90 - dx * 45
    const p1 = fromPosition.add(
      new Vec(0, -1).multiply(20 + Math.abs(dy * 100)).rotate(toRadians(b))
    )

    // const p1 = from.add({ x, y })
    // const p2 = to.subtract({ x, y })

    // const normal = delta.normal().normalize()
    // const dir = delta.x < 0 ? -1 : 1

    // const p3 = from.add(delta.multiply(0.3)).add(normal.multiply(100 * dir))
    // const p4 = to.subtract(delta.multiply(0.3)).add(normal.multiply(-100 * dir))

    const handles = [p1, p2]
    // const handles = delta.y > 0 ? [p1, p2] : [p1, p3, p4, p2]

    return {
      description: createHobbyCurve([fromPosition, ...handles, toPosition]),
      handles,
    }
  })
