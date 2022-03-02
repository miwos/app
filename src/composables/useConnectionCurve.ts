import { createHobbyCurve } from 'hobby-curve'
import { computed } from 'vue'

import Vec from 'tiny-vec'
import { toRadians } from '../utils'
import { useInstances } from '@/store/instances'
import { ConnectionPoint } from '@/types/Connection'
import { useModules } from '@/store/modules'
import { useShapes } from '@/store/shapes'
import { ShapeInputOutput } from 'shape-compiler'

const getPointAndAngle = ({
  id,
  index,
  instanceId,
  isInOut,
}: ConnectionPoint): [Vec, number] => {
  const instance = useInstances().get(instanceId)
  const module = useModules().get(instance.moduleId)
  const shape = useShapes().get(module.shapeId)

  const inOutId = `inout-${index}` as ShapeInputOutput['id']
  const { position, angle } = shape.inputsOutputs[isInOut ? inOutId : id]

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

    // A `inout` angle refers to the input, so we have to flip it to use it as
    // on output.
    if (from.isInOut) fromAngle += 180

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
