import { createHobbyCurve } from 'hobby-curve'
import { computed } from 'vue'

import Vec from 'tiny-vec'
import { toRadians } from '../utils'
import { useInstances } from '@/store/instances'
import { ConnectionPoint } from '@/types/Connection'

const getPointAndAngle = ({
  id,
  instanceId,
}: ConnectionPoint): [Vec, number] => {
  const instance = useInstances().get(instanceId)
  const { position, angle } = instance.shape.inputsOutputs[id]
  const point = new Vec(instance.position).add(position)
  return [point, angle]
}

export const useConnectionCurve = (
  from: ConnectionPoint,
  to: ConnectionPoint
) =>
  computed(() => {
    let [fromPoint, fromAngle] = getPointAndAngle(from)
    let [toPoint, toAngle] = getPointAndAngle(to)

    // A `inout` angle refers to the input, so we have to flip it to use it as
    // on output.
    if (from.direction === 'inout') fromAngle += 180

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
