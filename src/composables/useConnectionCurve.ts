import { createHobbyCurve } from 'hobby-curve'
import { computed } from 'vue'

import Vec from 'tiny-vec'
import { toRadians } from '../utils'
import { useInstances } from '@/stores/instances'
import { ConnectionPoint } from '@/types/Connection'
import { useModules } from '@/stores/modules'
import { useShapes } from '@/stores/shapes'

const getPointAndAngle = ({
  id,
  instanceId,
}: ConnectionPoint): [Vec, number] => {
  const instance = useInstances().get(instanceId)
  const module = useModules().getByInstanceId(instanceId)
  const shape = useShapes().get(module.shapeId)

  const { position, angle } = shape.inputsOutputs[id]
  const point = new Vec(instance.position).add(position.inset)

  return [point, angle]
}

export const useConnectionCurve = (
  from: ConnectionPoint,
  to: ConnectionPoint
) =>
  computed(() => {
    let [fromPoint, fromAngle] = getPointAndAngle(from)
    let [toPoint, toAngle] = getPointAndAngle(to)

    // The normalized distance.
    const distance = toPoint
      .subtract(fromPoint)
      .divide({ x: window.innerWidth, y: window.innerHeight })

    const c1 = fromPoint.add(
      new Vec(0, -1)
        .multiply(20 + Math.abs(distance.x * 50))
        .rotate(toRadians(fromAngle - 90))
    )

    const c2 = toPoint.add(
      new Vec(0, -1)
        .multiply(20 + Math.abs(distance.x * 50))
        .rotate(toRadians(toAngle - 90))
    )

    const controls = [c1, c2]
    const data = createHobbyCurve([fromPoint, ...controls, toPoint])

    return { data, controls }
  })
